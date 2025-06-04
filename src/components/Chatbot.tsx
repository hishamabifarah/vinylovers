'use client';
import Image from 'next/image';
import { useState } from 'react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hi, I am VinyBot - your vinyl & music expert. Ask me anything about records or music!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    const timestamp = new Date().toISOString();

    const newMessages: Message[] = [
      ...messages,
      { sender: 'user' as const, text: userMsg, timestamp },
    ];
    setMessages(newMessages);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionMessages: newMessages }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply, timestamp: new Date().toISOString() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Oops, something went wrong. Try again!',
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setTyping(false);
  };

  // Helper: format timestamp to "x minutes ago"
  const timeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);

    const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
      [60, 'second'],
      [60, 'minute'],
      [24, 'hour'],
      [7, 'day'],
      [4.3, 'week'],
      [12, 'month'],
      [Number.POSITIVE_INFINITY, 'year'],
    ];

    let duration = seconds;
    let unit: Intl.RelativeTimeFormatUnit = 'second';

    for (let i = 0; i < intervals.length; i++) {
      const [amount, newUnit] = intervals[i];
      if (duration < amount) break;
      duration /= amount;
      unit = newUnit;
    }

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    return rtf.format(-Math.floor(duration), unit);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!isOpen ? (
        <button
          className="bg-[#e01b24] text-white px-2 py-2 rounded-full shadow-lg hover:brightness-110 transition"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-2xl">💬</span>
        </button>
      ) : (
        <div className="w-80 max-w-[90vw] h-96 max-h-[75vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#e01b24]">
          <div className="bg-[#e01b24] text-white p-3 flex justify-between items-center">
            <span className="font-bold">VinyBot</span>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
              ✕
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'bot' ? '' : 'justify-end'}`}>
                {msg.sender === 'bot' && (
                  <div className="mr-2 flex-shrink-0 w-6 h-6 rounded-full overflow-hidden bg-white">
                    <Image src="/favicon.ico" alt="VinyBot" width={24} height={24} />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div
                    className={`p-2 rounded-md ${
                      msg.sender === 'bot' ? 'bg-[#ffeaea] text-black' : 'bg-black text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {timeAgo(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="text-xs text-gray-400 italic animate-pulse">VinyBot is typing...</div>
            )}
          </div>

          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 text-black bg-[#fef2f2] border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01b24]/50"
              placeholder="Ask me about vinyl..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              className="bg-[#e01b24] text-white px-3 rounded hover:brightness-110 transition"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
