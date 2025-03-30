"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getVinylDataInclude } from "@/lib/types";
import { revalidateTag } from 'next/cache'

import kyInstance from "@/lib/ky"
import type { VinylData } from "@/lib/types"
import { z } from "zod"

const vinylSchema = z.object({
  id: z.string(),
  artist: z.string().min(1, "Required"),
  album: z.string().min(1, "Required"),
  genreId: z.string().min(1, "Required"),
  hashtags: z.string().optional(),
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
})

export type EditVinylValues = z.infer<typeof vinylSchema>

export async function updateVinyl(values: EditVinylValues): Promise<VinylData> {

  try {
    // Since this is a server action, we can directly update the database
    // instead of making an API call
    const { user } = await validateRequest()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Find the vinyl
    const currentVinyl = await prisma.vinyl.findUnique({
      where: {
        id: values.id,
      },
      include: { attachments: true },
    })

    if (!currentVinyl) {
      throw new Error("Vinyl not found")
    }

    if (currentVinyl.userId !== user.id) {
      throw new Error("Unauthorized")
    }

    // Process attachments
    const currentAttachmentIds = currentVinyl.attachments.map((a) => a.id)

    const attachmentsToDisconnect = currentAttachmentIds.filter((id) => !values.mediaIds.includes(id))
    const attachmentsToConnect = values.mediaIds.filter((id) => !currentAttachmentIds.includes(id))

    // Prepare update data
    const updateData = {
      artist: values.artist,
      album: values.album,
      genreId: values.genreId,
      hashtags: values.hashtags || null,
    }

    // Only include attachments operations if there are changes
    if (attachmentsToDisconnect.length > 0 || attachmentsToConnect.length > 0) {
      Object.assign(updateData, {
        attachments: {
          ...(attachmentsToDisconnect.length > 0
            ? {
                disconnect: attachmentsToDisconnect.map((id: string) => ({ id })),
              }
            : {}),
          ...(attachmentsToConnect.length > 0
            ? {
                connect: attachmentsToConnect.map((id: string) => ({ id })),
              }
            : {}),
        },
      })
    }

    // Update the vinyl
    const updatedVinyl = await prisma.vinyl.update({
      where: {
        id: values.id,
      },
      data: updateData,
      include: getVinylDataInclude(user.id),
    })

    revalidateTag('vinyl-featured')

    return updatedVinyl
  } catch (error) {
    console.error("Update vinyl error:", error)
    throw error
  }
}

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

  revalidateTag('vinyl-featured')

  return deletedVinyl;
}