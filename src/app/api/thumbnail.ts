import { type NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get("image")

  if (!imageUrl) {
    return new NextResponse("Image URL missing", { status: 400 })
  }

  try {
    // Fetch the original image
    const response = await fetch(imageUrl)

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      return new NextResponse("Failed to fetch original image", { status: 502 })
    }

    const buffer = await response.arrayBuffer()

    // Resize the image
    const resizedImage = await sharp(Buffer.from(buffer))
      .resize(1200, 630, { fit: "cover" }) // Standard OG image dimensions
      .jpeg({ quality: 80 }) // Compress to save bandwidth
      .toBuffer()

    // Set proper caching headers
    return new NextResponse(resizedImage, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error generating thumbnail:", error)
    return new NextResponse("Error generating thumbnail", { status: 500 })
  }
}

