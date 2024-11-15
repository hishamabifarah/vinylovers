"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getVinylDataInclude } from "@/lib/types";
import { newVinylSchema } from "@/lib/validation";

export async function submitVinyl(input: {
  artist: string;
  album: string;
  genre: string;
}) {

  console.log('submitVinyl inside' , input);
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { artist , genre , album } = newVinylSchema.parse(input);

  const newVinyl = await prisma.vinyl.create({
    data: {
      artist,
      genre,
      album,
      userId: user.id,
    },
    include: getVinylDataInclude(user.id),
  });

  console.log('newVinyl' , newVinyl)

  // return the new Post to add to the mutation onsucess function
  return newVinyl;
}