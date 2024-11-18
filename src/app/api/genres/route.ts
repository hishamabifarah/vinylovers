import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      select: {
        id: true,
        name: true,
        thumbnail: true,
        _count: {
          select: { vinyls: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedGenres = genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
      thumbnail: genre.thumbnail,
      vinylCount: genre._count.vinyls
    }))

    return NextResponse.json(formattedGenres)
  } catch (error) {
    console.error('Error fetching genres:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}