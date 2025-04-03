import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"
import { NextResponse } from "next/server"

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(hashtags, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM vinyls
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count), // cant send bigint between client and server
    }))
  },
  ["trending_topics"], // key for unstable_cache
  {
    revalidate: 3 * 60 * 60, // cached for 3 hours in production
  },
)

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
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  },
  ["vinyl-sitemap"],
  {
    revalidate: 3 * 60 * 60,
    tags: ["vinyl-sitemap"],
  },
)

export async function GET() {
  const baseUrl = "https://vinylovers.vercel.app"
  const vinyls = await getVinyls()
  const trendingTopics = await getTrendingTopics()

  // Ensure XML-safe encoding for all dynamic values
  const encodeXML = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }

  const urls = vinyls
    .map(
      (vinyl) => `
      <url>
        <loc>${encodeXML(`${baseUrl}/vinyls/${vinyl.artist}/${vinyl.album}/${vinyl.id}`)}</loc>
        <lastmod>${vinyl.modifiedAt}</lastmod>
        <priority>0.8</priority>
      </url>
    `
    )
    .join("")
    const urlsTopics = trendingTopics
      .map(
        (topic) => `
        <url>
          <loc>${encodeXML(`${baseUrl}/hashtag/${topic.hashtag.replace('#', '')}`)}</loc>
          <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
          <priority>0.8</priority>
        </url>
      `,
      )
      .join("")

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
    <url>
      <loc>${baseUrl}/vinyls/genres</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Country/8</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Blues/13</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Classical/10</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Dance-Electronic/6</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Folk-Acoustic/9</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Hip-Hop/4</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Jazz/11</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Latin/5</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Metal/1</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/New%20Age/12</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Pop/3</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/R&amp;B/7</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/Rock/2</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>${baseUrl}/vinyls/genres/R&amp;B/7</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>
    ${urlsTopics}
  </urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  })
}

