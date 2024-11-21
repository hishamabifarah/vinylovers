"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getVinylDataInclude } from "@/lib/types";
import { newVinylSchema } from "@/lib/validation";

export async function submitVinyl(input: {
  artist: string;
  album: string;
  genreId: string;
  hashtags?: string
}) {

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { artist , genreId , album , hashtags} = newVinylSchema.parse(input);

  const newVinyl = await prisma.vinyl.create({
    data: {
      artist,
      genreId,
      album,
      userId: user.id,
      hashtags: hashtags || null,
    },
    include: getVinylDataInclude(user.id),
  });

  // return the new vinyl to add to the mutation onsucess function
  return newVinyl;
}