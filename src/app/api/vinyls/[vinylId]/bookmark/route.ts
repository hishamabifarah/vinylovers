import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { vinylId } }: { params: { vinylId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_vinylId: {
          userId: loggedInUser.id,
          vinylId,
        },
      },
    });

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { vinylId } }: { params: { vinylId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.bookmark.upsert({
      where: {
        userId_vinylId: {
          userId: loggedInUser.id,
          vinylId,
        },
      },
      create: {
        userId: loggedInUser.id,
        vinylId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { vinylId } }: { params: { vinylId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        vinylId,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}