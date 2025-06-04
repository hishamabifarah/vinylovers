import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import {Filter} from 'bad-words';
import prisma from "@/lib/prisma";
import type { ChatCompletionMessageParam } from 'openai/resources/chat';
import {getClientIP} from "@/lib/network";

 const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
});

const filter = new Filter();

// In-memory session store for per-IP chat messages (resets on refresh)
const sessions = new Map<string, { messages: any[] }>();

export async function POST(req: Request) {
  const { message } = await req.json();

  // Get IP address from headers (depending on Vercel, etc.)
  // const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const ip = getClientIP(req);

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
  }

  // STEP 1: Check if IP is banned
  const banEntry = await prisma.bannedIPAddress.findUnique({ where: { ip } });
  if (banEntry?.banned) {
    return NextResponse.json({ reply: "🚫 You're banned for repeated violations." }, { status: 403 });
  }

  // STEP 2: Get or create session
  if (!sessions.has(ip)) {
    sessions.set(ip, { messages: [] });
  }
  const session = sessions.get(ip)!;

  // STEP 3: Check for profanity
  const isProfane = filter.isProfane(message);

  if (isProfane) {
    if (!banEntry) {
      // First offense: warn and store IP in DB
      let country = null;
      let city = null;

      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geo = await geoRes.json();
        country = geo?.country_name || null;
        city = geo?.city || null;
      } catch {}

      await prisma.bannedIPAddress.create({
        data: {
          ip,
          hits: 1,
          lastWarningAt: new Date(),
          banned: false,
          reason: 'First profanity warning',
          country,
          city,
        },
      });

      const warning = "⚠️ Please avoid inappropriate language. This is your first warning.";
      session.messages.push({ sender: 'bot', text: warning, timestamp: new Date().toISOString() });
      return NextResponse.json({ reply: warning });
    }

    if (banEntry.hits >= 1 && !banEntry.banned) {
      // Second offense: ban
      await prisma.bannedIPAddress.update({
        where: { ip },
        data: {
          hits: banEntry.hits + 1,
          banned: true,
          reason: 'Repeated profanity',
        },
      });

      return NextResponse.json({ reply: "🚫 You've been banned for repeated violations." }, { status: 403 });
    }
  }

  // STEP 4: Store user's message
  session.messages.push({
    sender: 'user',
    text: message,
    timestamp: new Date().toISOString(),
  });

  // STEP 5: Prepare OpenAI message payload
// Manually cast each object to ChatCompletionMessageParam to satisfy the union type
const messagesForAI: ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      'You are VinyBot, a friendly and knowledgeable vinyl records expert. Answer user questions about music, records, and artists in a helpful tone.',
  },
  ...session.messages.slice(-6).map((m) => {
    const role = m.sender === 'user' ? 'user' : 'assistant' as 'user' | 'assistant';
    return {
      role,
      content: m.text,
    };
  }),
];
  // STEP 6: Get AI response
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messagesForAI,
      temperature: 0.7,
    });

    const reply = response.choices[0].message?.content || 'No reply from AI.';

    session.messages.push({
      sender: 'bot',
      text: reply,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    return NextResponse.json(
      { reply: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
