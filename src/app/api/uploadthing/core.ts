import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import streamServerClient from "@/lib/stream";
import { Readable } from "stream"
import sharp from "sharp";
import crypto from "crypto";

function generateUniqueFileName(originalName: string): string {
  const hash = crypto.randomBytes(16).toString("hex"); // Generate a random 16-byte hash
  const extension = originalName.split(".").pop(); // Extract the file extension
  return `${hash}.${extension}`; // Combine hash and extension
}

// Helper function to generate a resized thumbnail
async function generateThumbnail(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  // Resize the image using sharp
  const resizedBuffer = await sharp(Buffer.from(buffer))
    .resize(1200, 630) // Resize to 300x300 pixels
    .jpeg({ quality: 80 })
    .toBuffer();


  // Generate a unique file name for the thumbnail
  const uniqueFileName = generateUniqueFileName("thumbnail.jpg");

  // Create a File-like object for UploadThing
  const thumbnailBlob = new Blob([resizedBuffer], { type: "image/jpeg" });
  const thumbnailFile = new File([thumbnailBlob], uniqueFileName, {
    type: "image/jpeg",
  });

  // Upload the thumbnail using UploadThing
  const uploadResponse = await new UTApi().uploadFiles([thumbnailFile]);

  if (!uploadResponse[0]?.data?.url) {
    throw new UploadThingError("Thumbnail upload failed");
  }

  return uploadResponse[0].data.url; // Return the new thumbnail URL
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
    // file is the file upload and metadata is the info returned from middleware: { user }
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) { // get current avatar, get its key then delete it, so each use will have on image and the older image is deleted from file system 

        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles(key);
      }

      // get the app id from env and construct a new url from uploadthing url so it will be unique to the app and only us can use uploadthings with 
      // uploading images because only the website has the app id
      // we also have the whitelist the url in next.config to use with next/image
      // also we allow to resize images only the ones with own with the new url for seurity so no one else can resizeimages om vercel because it takes computing powers
      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );


      // const transformedUrl =
      //   process.env.NODE_ENV === "production"
      //     ? newAvatarUrl.replace("f90wrdja4t.ufs.sh/a/", `utfs.io/a/`)
      //     : newAvatarUrl.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)

      const transformedUrl = newAvatarUrl.replace("f90wrdja4t.ufs.sh/a/", `utfs.io/a/`)


      // await prisma.user.update({
      //   where: { id: metadata.user.id },
      //   data: {
      //     avatarUrl: transformedUrl,
      //   },
      // });

      await Promise.all([
        prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: transformedUrl,
          },
        }),
        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: transformedUrl,
          },
        }),
      ]);

      return { avatarUrl: transformedUrl }; // return new avatarurl to the frontend to upddate cache of feeds immediatly
    }),

  // vinyl media upload
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
      // const originalUrl = file.url;

      // const media = await prisma.media.create({
      //   data: {
      //     url: file.url.replace(
      //       "/f/",
      //       `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      //     ),
      //     type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
      //   },
      // });

      const originalUrl = file.url;

      // Transform the URL to the correct format based on environment
      const transformedUrl =
        process.env.NODE_ENV === "production"
          ? originalUrl.replace("f90wrdja4t.ufs.sh/f/", `utfs.io/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)
          : originalUrl.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`);

      let thumbnailUrl: string | undefined = transformedUrl;

      // If it's an image, try to generate a thumbnail
      if (file.type.startsWith("image")) {
        try {
          thumbnailUrl = await generateThumbnail(originalUrl);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
          // Fallback: use the transformedUrl as the thumbnail
          thumbnailUrl = transformedUrl;
        }
      }

      // Create the media record with the appropriate URL
      const media = await prisma.media.create({
        data: {
          url: transformedUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          thumbnailUrl, // Always set thumbnailUrl
        },
      });

      // return { mediaId: media.id }

      return { mediaId: media.id }; // return mediaId to the frontend for each upload
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;