import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { getVinylDataInclude } from "@/lib/types";

// Validation schema for update request
const updateVinylSchema = z.object({
  artist: z.string().min(1, "Artist is required"),
  album: z.string().min(1, "Album is required"),
  genreId: z.string().min(1, "Genre is required"),
  hashtags: z.string().optional(),
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { vinylId: string } }
) {
  try {
    // Validate user authentication
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const vinylId = params.vinylId;

    // Check if vinyl exists
    const existingVinyl = await prisma.vinyl.findUnique({
      where: { id: vinylId },
      select: {
        id: true,
        userId: true,
        attachments: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingVinyl) {
      return NextResponse.json({ error: "Vinyl not found" }, { status: 404 });
    }

    // Check if user owns the vinyl (you can remove this if you prefer)
    if (existingVinyl.userId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this vinyl" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateVinylSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { artist, album, genreId, hashtags, mediaIds } = validationResult.data;

    // Get existing attachment IDs
    const existingAttachmentIds = existingVinyl.attachments.map((a) => a.id);
    
    // Determine which attachments to delete
    const attachmentsToDelete = existingAttachmentIds.filter(
      (id) => !mediaIds.includes(id)
    );

    // Update the vinyl record
    const updatedVinyl = await prisma.vinyl.update({
      where: { id: vinylId },
      data: {
        artist,
        album,
        genreId,
        hashtags,
        // Handle attachments - delete ones that are no longer needed
        attachments: attachmentsToDelete.length > 0 ? {
          deleteMany: {
            id: { in: attachmentsToDelete }
          }
        } : undefined
      },
      include: getVinylDataInclude(user.id),
    });

    return NextResponse.json(updatedVinyl);
  } catch (error) {
    console.error("Error updating vinyl:", error);
    return NextResponse.json(
      { error: "Failed to update vinyl" },
      { status: 500 }
    );
  }
}