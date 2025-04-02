import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

const getVinyls = unstable_cache(
    async () => {
    
    return await prisma.vinyl.findMany({
      select: {
        id: true,
        artist: true,
        thumbnail: true,
        album: true,
        createdAt: true,
        modifiedAt: true,
        attachments: true,
        genre: {
          select: {
            id: true,
            name: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },
  ["vinyl-sitemap"],
  { 
    revalidate: 600, 
    tags: ['vinyl-sitemap'] // Add tags
  }
)

export async function GET() {
  const baseUrl = "https://vinylovers.vercel.app";
  const vinyls = await getVinyls();

  const urls = vinyls
    .map((vinyl) => `
      <url>
        <loc>${baseUrl}/vinyls/${vinyl.artist}/${vinyl.album}/${vinyl.id}</loc>
        <lastmod>${vinyl.modifiedAt}</lastmod>
        <priority>0.8</priority>
      </url>
    `)
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${baseUrl}/home</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.9</priority>
    </url>
    ${urls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}