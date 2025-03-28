import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getVinylDataInclude } from "@/lib/types"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { vinylId: string } }) {
  console.log("==== EDIT VINYL ENDPOINT CALLED ====")
  console.log("Params:", JSON.stringify(params))
  console.log("Vinyl ID from params:", params.vinylId) // Using vinylId, not id

  try {
    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract the vinyl ID from params
    const vinylId = params.vinylId // Using vinylId, not id
    console.log("Vinyl ID for database query:", vinylId)

    // Parse the request body
    const data = await request.json()
    const { artist, album, genreId, hashtags, mediaIds } = data

    // Try to find the vinyl
    const currentVinyl = await prisma.vinyl.findUnique({
      where: {
        id: vinylId,
      },
      include: { attachments: true },
    })

    if (!currentVinyl) {
      return NextResponse.json({ error: "Vinyl not found" }, { status: 404 })
    }

    if (currentVinyl.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Process attachments
    const currentAttachmentIds = currentVinyl.attachments.map((a) => a.id)

    const attachmentsToDisconnect = currentAttachmentIds.filter((id) => !mediaIds.includes(id))
    const attachmentsToConnect = mediaIds.filter((id:string) => !currentAttachmentIds.includes(id))

    // Prepare update data
    const updateData = {
      artist,
      album,
      genreId,
      hashtags: hashtags || null,
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
        id: vinylId,
      },
      data: updateData,
      include: getVinylDataInclude(user.id),
    })

    return NextResponse.json(updatedVinyl)
  } catch (error) {
    console.error("Error updating vinyl:", error)
    return NextResponse.json(
      {
        error: "Failed to update vinyl",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

