import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

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

      
      const transformedUrl =
      process.env.NODE_ENV === "production"
        ? newAvatarUrl.replace("f90wrdja4t.ufs.sh/f/", `utfs.io/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)
        : newAvatarUrl.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: transformedUrl,
        },
      });

      return { avatarUrl: transformedUrl }; // return new avatarurl to the frontend to upddate cache of feeds immediatly
    }),

    // vinyl media upload
    attachment: f({
      image: { maxFileSize: "4MB", maxFileCount: 5 },
      video: { maxFileSize: "64MB", maxFileCount: 5 },
    })
      .middleware(async () => {
        const { user } = await validateRequest();
  
        if (!user) throw new UploadThingError("Unauthorized");
  
        return {};
      })
      .onUploadComplete(async ({ file }) => {
        // const originalUrl = file.url;

        // console.log('originalUrl', originalUrl);

        // const media = await prisma.media.create({
        //   data: {
        //     url: file.url.replace(
        //       "/f/",
        //       `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        //     ),
        //     type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        //   },
        // });

        const originalUrl = file.url

        // Transform the URL to the correct format based on environment
        const transformedUrl =
          process.env.NODE_ENV === "production"
            ? originalUrl.replace("f90wrdja4t.ufs.sh/f/", `utfs.io/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)
            : originalUrl.replace("/f/", `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)
  
        // Create the media record with the appropriate URL
        const media = await prisma.media.create({
          data: {
            url: transformedUrl,
            type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          },
        })
  
        // return { mediaId: media.id }
  
        return { mediaId: media.id }; // return mediaId to the frontend for each upload
      }),
  } satisfies FileRouter;
  
  export type AppFileRouter = typeof fileRouter;