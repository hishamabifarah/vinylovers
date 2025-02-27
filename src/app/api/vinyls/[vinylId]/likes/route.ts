import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { vinylId } }: { params: { vinylId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vinyl = await prisma.vinyl.findUnique({
      where: { id: vinylId },
      select: {
        likes: { // like of loggedinuser to know if user already liked the vinyl
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true, // only userId no need more info
          },
        },
        _count: { // count of likes
          select: {
            likes: true,
          },
        },
      },
    });

    if (!vinyl) {
      return Response.json({ error: "Vinyl not found" }, { status: 404 });
    }

    const data: LikeInfo = {
      likes: vinyl._count.likes, // number of likes
      isLikedByUser: !!vinyl.likes.length, 
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

    await prisma.like.upsert({
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
  { params: { vinylId } }: { params: { vinylId : string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.like.deleteMany({
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