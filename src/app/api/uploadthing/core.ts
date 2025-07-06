import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import streamServerClient from "@/lib/stream";
import sharp from "sharp";
import crypto from "crypto";

// Utility to generate a unique file name with correct extension
function generateUniqueFileName(originalName: string): string {
  const hash = crypto.randomBytes(16).toString("hex");
  const extension = originalName.split(".").pop();
  return `${hash}.${extension}`;
}

// Gracefully attempt to generate a resized thumbnail
async function generateThumbnail(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import of ESM-only file-type
    const { fileTypeFromBuffer } = await import("file-type");
    const type = await fileTypeFromBuffer(new Uint8Array(buffer));

    if (!type || !["image/jpeg", "image/png", "image/webp"].includes(type.mime)) {
      console.warn("Unsupported image type. Skipping thumbnail generation.");
      return imageUrl;
    }

    const isJpeg = type.mime === "image/jpeg";
    const format = isJpeg ? "jpeg" : "webp";
    const mimeType = isJpeg ? "image/jpeg" : "image/webp";
    const extension = isJpeg ? "jpg" : "webp";

    const resizedBuffer = await sharp(buffer, { failOnError: false })
      .resize(1200, 630)
      [format]({ quality: 80 })
      .toBuffer();

    const uniqueFileName = generateUniqueFileName(`thumbnail.${extension}`);
    const thumbnailBlob = new Blob([resizedBuffer], { type: mimeType });
    const thumbnailFile = new File([thumbnailBlob], uniqueFileName, {
      type: mimeType,
    });

    const uploadResponse = await new UTApi().uploadFiles([thumbnailFile]);
    if (!uploadResponse[0]?.data?.url) {
      console.warn("Upload failed. Using original image.");
      return imageUrl;
    }

    return uploadResponse[0].data.url;
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return imageUrl;
  }
}

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )[1];
        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      const transformedUrl = newAvatarUrl.replace(
        "f90wrdja4t.ufs.sh/a/",
        `utfs.io/a/`
      );

      await Promise.all([
        prisma.user.update({
          where: { id: metadata.user.id },
          data: { avatarUrl: transformedUrl },
        }),
        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: { image: transformedUrl },
        }),
      ]);

      return { avatarUrl: transformedUrl };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 6 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const originalUrl = file.url;

      const transformedUrl =
        process.env.NODE_ENV === "production"
          ? originalUrl.replace(
              "f90wrdja4t.ufs.sh/f/",
              `utfs.io/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
            )
          : originalUrl.replace(
              "/f/",
              `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
            );

      let thumbnailUrl: string;

      if (file.type.startsWith("image")) {
        const rawThumb = await generateThumbnail(originalUrl);
        thumbnailUrl =
          process.env.NODE_ENV === "production"
            ? rawThumb.replace(
                "f90wrdja4t.ufs.sh/f/",
                `utfs.io/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
              )
            : rawThumb.replace(
                "/f/",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
              );
      } else {
        thumbnailUrl = transformedUrl;
      }

      const media = await prisma.media.create({
        data: {
          url: transformedUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          thumbnailUrl,
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
