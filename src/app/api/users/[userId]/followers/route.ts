"use server"
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

// return the follower info for this user
// return total number of followers
// return if the current logged in user if following this user

export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest(); // check if user is logged

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: { // retrieve the follow of loggedinuser
          where: {
            followerId: loggedInUser.id,
          },
          select: { 
            followerId: true, // only select the follower id
          },
        },
        _count: {
          select: {
            followers: true, // count followers
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length, // true if userId (!! turns into boolean) , if length is not 0 true else false
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// follow a user
export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ignores if follow exists, create throws an error, better to use upsert cause of uniqe constraint in Follow model 
    // ( @@unique([followerId, followingId]))
    // await prisma.follow.upsert({ 
    //   where: {
    //     followerId_followingId: {
    //       followerId: loggedInUser.id,
    //       followingId: userId,
    //     },
    //   },
    //   create: {
    //     followerId: loggedInUser.id,
    //     followingId: userId,
    //   },
    //   update: {}, // because upsert we have to add update , because upsert is add and update
    // });

    await prisma.$transaction([
      prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: loggedInUser.id,
            followingId: userId,
          },
        },
        create: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
        update: {},
      }),
      prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// unfollow a user
export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // await prisma.follow.deleteMany({ // like upset, wont throw error if connection not exists in DB
    //   where: {
    //     followerId: loggedInUser.id,
    //     followingId: userId,
    //   },
    // });

    await prisma.$transaction([
      prisma.follow.deleteMany({
        where: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}