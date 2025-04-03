import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { imageUrl } = req.query;

  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    // Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the image");
    }
    const buffer = await response.buffer();

    // Resize the image to 1200x630
    const resizedImage = await sharp(buffer)
      .resize(1200, 630, { fit: "cover" })
      .toBuffer();

    // Set the response headers and return the resized image
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.status(200).send(resizedImage);
  } catch (error) {
    console.error("Error resizing image:", error);
    res.status(500).json({ error: "Failed to resize the image" });
  }
}