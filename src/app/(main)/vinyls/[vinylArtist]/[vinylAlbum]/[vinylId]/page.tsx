import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import UserAvatar from "@/components/UserAvatar";
import Vinyl from "@/components/vinyls/Vinyl";
import prisma from "@/lib/prisma";
import { getVinylDataInclude, UserData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { cache, Suspense, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VinylAffiliate from "@/components/VinylAffiliate";

interface PageProps {
  params: { vinylArtist: string; vinylAlbum: string; vinylId: string };
}

// Get Vinyl Data
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

// 🚀 Generate Full SEO Metadata
export async function generateMetadata({ params }: PageProps) {
  console.log('parans', params);
  const { vinylArtist, vinylAlbum, vinylId } = params;
  const { user } = await validateRequest();
  const vinyl = await getVinyl(vinylId, user?.id);

  const pageTitle = `${vinyl.artist} - ${vinyl.album}`;
  const pageDescription = `Discover ${vinyl.artist}'s album "${vinyl.album}" on Vinylovers. See vinyl details, connect with collectors, and share your collection.`;
  const pageUrl = `https://vinylovers.net/vinyls/${vinylArtist}/${vinylAlbum}/${vinylId}`;
  // const imageUrl = vinyl.attachments[0].url || "https://vinylovers.vercel.app/logo192.png";

    // Select first image or fallback to default
    const originalImageUrl = vinyl.attachments[0].url || "https://vinylovers.vercel.app/logo192.png";

    // Generate a resized thumbnail URL (using a Next.js API route or external service)
    const thumbnailUrl = `https://vinylovers.net/api/thumbnail?image=${encodeURIComponent(originalImageUrl)}`;


  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: "music.album",
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [{ url: thumbnailUrl, width: 900, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [thumbnailUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// JSON-LD Structured Data
// function JSONLD({ vinyl }) {
//   useEffect(() => {
//     const jsonLd = {
//       "@context": "https://schema.org",
//       "@type": "MusicRecording",
//       "name": vinyl.album,
//       "byArtist": {
//         "@type": "MusicGroup",
//         "name": vinyl.artist,
//       },
//       "inAlbum": {
//         "@type": "MusicAlbum",
//         "name": vinyl.album,
//         "byArtist": {
//           "@type": "MusicGroup",
//           "name": vinyl.artist,
//         },
//       },
//       "datePublished": vinyl.releaseDate,
//       "genre": vinyl.genre,
//       "image": vinyl.image,
//       "url": `https://vinylovers.net/vinyls/${vinyl.artist}/${vinyl.album}/${vinyl.id}`,
//     };

//     const script = document.createElement("script");
//     script.type = "application/ld+json";
//     script.innerHTML = JSON.stringify(jsonLd);
//     document.head.appendChild(script);

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, [vinyl]);

//   return null;
// }

// 🚀 Page Component
export default async function Page({ params }: PageProps) {
  const { vinylArtist, vinylAlbum, vinylId } = params;
  const { user } = await validateRequest();
  const vinyl = await getVinyl(vinylId, user?.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      {/* Inject JSON-LD Schema */}
      {/* <JSONLD vinyl={vinyl} /> */}

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

// Sidebar Component
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
        <Link href="/login">
          <Button className="w-full mt-5 text-white bg-primary hover:bg-primary/80">
            Sign in to follow
          </Button>
        </Link>
      ) : user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id
            ),
          }}
        />
      )}
    </div>
  );
}
