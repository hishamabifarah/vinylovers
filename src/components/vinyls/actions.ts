"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getVinylDataInclude } from "@/lib/types";

export async function deleteVinyl(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const vinyl = await prisma.vinyl.findUnique({
    where: { id },
  });

  if (!vinyl) throw new Error("Vinyl not found");

  if (vinyl.userId !== user.id) throw new Error("Unauthorized");

  const deletedVinyl = await prisma.vinyl.delete({
    where: { id },
    include: getVinylDataInclude(user.id),
  });

  return deletedVinyl;
}