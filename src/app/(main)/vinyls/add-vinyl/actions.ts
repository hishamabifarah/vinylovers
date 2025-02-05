"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getVinylDataInclude } from "@/lib/types";
import { newVinylSchema } from "@/lib/validation";

// ReactQuery's useMutation hook allows one function arguments so we use input as an array
export async function submitVinyl(input: {
  artist: string;
  album: string;
  genreId: string;
  hashtags?: string;
  mediaIds: string[];
}) {

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { artist , genreId , album , hashtags , mediaIds} = newVinylSchema.parse(input);

  const newVinyl = await prisma.vinyl.create({
    data: {
      artist,
      genreId,
      album,
      userId: user.id,
      hashtags: hashtags || null,
      attachments: {
        connect: mediaIds.map((id) => ({ id })), // connect updates media entries for these id and adds id of newly created vinyl
      },
    },
    include: getVinylDataInclude(user.id),
  });

  // return the new vinyl to add to the mutation onsucess function
  return newVinyl;
}