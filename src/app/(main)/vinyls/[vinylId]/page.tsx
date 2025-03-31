import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import UserAvatar from "@/components/UserAvatar";
import Vinyl from "@/components/vinyls/Vinyl";
import prisma from "@/lib/prisma";
import { getVinylDataInclude, UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VinylAffiliate from "@/components/VinylAffiliate";

interface PageProps {
  params: { vinylId: string };
}

// Modified to handle non-logged-in users with optional userId
const getVinyl = cache(async (vinylId: string, loggedInUserId?: string) => {
  const vinyl = await prisma.vinyl.findUnique({
    where: {
      id: vinylId,
    },
    include: getVinylDataInclude(loggedInUserId || ""),
  });

  if (!vinyl) return notFound();

  return vinyl;
});

export async function generateMetadata({ params: { vinylId } }: PageProps) {
  const { user } = await validateRequest();
  const vinyl = await getVinyl(vinylId, user?.id);

  return {
    title: `${vinyl.user.displayName} : ${vinyl.artist} - ${vinyl.album}`,
  };
}

export default async function Page({ params: { vinylId } }: PageProps) {
  const { user } = await validateRequest();
  const vinyl = await getVinyl(vinylId, user?.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Vinyl vinyl={vinyl} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={vinyl.user} />
        </Suspense>
        <VinylAffiliate
        className="mt-5"
          artist={vinyl.artist}
          vinylTitle={vinyl.album}
          />
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
        <h2 className="text-xl font-semibold">{user.displayName}</h2>
      </div>
      {user.bio && <p className="text-sm font-semibold">{user.bio}</p>}

      {!loggedInUser ? (
        // Show login button for non-logged in users
        <Link href="/login" >
          <Button className="w-full mt-5 text-white bg-primary hover:bg-primary/80">
            Sign in to follow
          </Button>
        </Link>
      ) : user.id !== loggedInUser.id && (
        // Show follow button for logged in users viewing others' profiles
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}

// import { validateRequest } from "@/auth";
// import FollowButton from "@/components/FollowButton";
// import UserAvatar from "@/components/UserAvatar";
// import Vinyl from "@/components/vinyls/Vinyl";
// import prisma from "@/lib/prisma";
// import { getVinylDataInclude, UserData } from "@/lib/types";
// import { Loader2 } from "lucide-react";
// import { notFound } from "next/navigation";
// import { cache, Suspense } from "react";

// interface PageProps {
//   params: { vinylId: string };
// }

// // takes param an async function with the 2 params
// // cache() explained in users/[username] page
// const getVinyl = cache(async (vinylId: string, loggedInUserId: string) => {
//   const vinyl = await prisma.vinyl.findUnique({
//     where: {
//       id: vinylId,
//     },
//     include: getVinylDataInclude(loggedInUserId),
//   });

//   if (!vinyl) return notFound();

//   return vinyl;
// });

// export async function generateMetadata({ params: { vinylId } }: PageProps) {
//   const { user } = await validateRequest();

//   if (!user) return {};

//   const vinyl = await getVinyl(vinylId, user.id);

//   return {
//     title: `${vinyl.user.displayName} : ${vinyl.artist} - ${vinyl.album}`,
//   };
// }

// export default async function Page({ params: { vinylId } }: PageProps) {
//   const { user } = await validateRequest();

//   if (!user) {
//     return (
//       <p className="text-destructive">
//         You&apos;re not authorized to view this page.
//       </p>
//     );
//   }

//   const vinyl = await getVinyl(vinylId, user.id);

//   return (
//     <main className="flex w-full min-w-0 gap-5">
//       <div className="w-full min-w-0 space-y-5">
//         <Vinyl vinyl={vinyl} />
//       </div>
//       <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
//         <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
//           <UserInfoSidebar user={vinyl.user} />
//         </Suspense>
//       </div>
//     </main>
//   );
// }

// interface UserInfoSidebarProps {
//   user: UserData;
// }

// async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
//   const { user: loggedInUser } = await validateRequest();

//   if (!loggedInUser) return null;

//   return (
//     <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
//       <div className="mb-4 flex items-center gap-4">
//         <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
//         <h2 className="text-xl font-semibold">{user.displayName}</h2>
//       </div>
//       <p className="text-sm font-semibold">{user.bio}</p>

//       {user.id !== loggedInUser.id && (
//         <FollowButton
//           userId={user.id}
//           initialState={{
//             followers: user._count.followers,
//             isFollowedByUser: user.followers.some(
//               ({ followerId }) => followerId === loggedInUser.id,
//             ),
//           }}
//         />
//       )}
//     </div>
//   );
// }
