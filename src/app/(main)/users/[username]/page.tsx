"use server"
import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowersCount";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, FollowersInfo, FollowingInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserVinyls from "./UserVinyls";
import EditProfileButton from "./EditProfileButton";
import FollowingCount from "@/components/FollowingCount";
import FollowersCount from "@/components/FollowersCount";
import CountFollowers from "@/components/CountFollowers";
import StartChatButton from "../../messages/components/StartChatButton";


interface PageProps {
  params: { username: string };
}

// we wrap it in a cache because we want the user info generateMetadata() and Page
// we make one request because cache deduplicates result and we can use user info in more than one place at the same time
const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});


export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

   // If the user is logged in but not verified
   if (!loggedInUser.verified) {
    return (
      <div>
        <p className="text-destructive">
          Your account is not verified. Please check your email for the verification link.
        </p>
        {/* <button onClick={resendVerificationEmail}>Resend Verification Email</button> */}
      </div>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s vinyls
          </h2>
        </div>
        <UserVinyls userId={user.id} />
      </div>
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  const followingInfo: FollowingInfo = {
    following: user._count.following,
    username: user.username,
    // isFollowedByUser: user.followers.some(
    //   ({ followerId }) => followerId === loggedInUserId,
    // ),
  };

  const InfoFollowers: FollowersInfo = {
    followers: user._count.followers,
    username: user.username,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Vinyls:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.vinyls)}
              </span>
            </span>

            {/* <CountFollowers userId={user.id} initialState={InfoFollowers} /> */}

            <CountFollowers
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                username: user.username, // Ensure this is passed
                isFollowedByUser: followerInfo.isFollowedByUser,
              }}
            />

            {/* <FollowerCount userId={user.id} initialState={followerInfo} /> */}

            <FollowingCount userId={user.id} initialState={followingInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}

      </div>
      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
      {/* <StartChatButton username={user.username} /> */}
    </div>

    
  );
}