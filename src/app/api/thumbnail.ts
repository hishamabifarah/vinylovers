import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get("image");

  if (!imageUrl) {
    return new NextResponse("Image URL missing", { status: 400 });
  }

  try {
    // Fetch the original image
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Resize the image
    const resizedImage = await sharp(Buffer.from(buffer))
      .resize(600, 600) // Resize to 600x600 for OpenGraph
      .jpeg({ quality: 80 }) // Compress to save bandwidth
      .toBuffer();

    return new NextResponse(resizedImage, {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return new NextResponse("Error generating thumbnail", { status: 500 });
  }
}
