import { validateRequest } from "@/auth"
import FollowButton from "@/components/FollowButton"
import UserAvatar from "@/components/UserAvatar"
import Vinyl from "@/components/vinyls/Vinyl"
import prisma from "@/lib/prisma"
import { getVinylDataInclude, type UserData } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import VinylAffiliate from "@/components/VinylAffiliate"
import { MusicAlbumJsonLd } from "@/components/JsonLd"

interface PageProps {
  params: { vinylArtist: string; vinylAlbum: string; vinylId: string }
}

// Get Vinyl Data
const getVinyl = cache(async (vinylId: string, loggedInUserId?: string) => {
  const vinyl = await prisma.vinyl.findUnique({
    where: {
      id: vinylId,
    },
    include: getVinylDataInclude(loggedInUserId || ""),
  })

  if (!vinyl) return notFound()
  return vinyl
})

// 🚀 Generate Full SEO Metadata
export async function generateMetadata({ params }: PageProps) {
  const { vinylId } = params
  const { user } = await validateRequest()
  const vinyl = await getVinyl(vinylId, user?.id)

  const pageTitle = `${vinyl.artist} - ${vinyl.album}`
  const pageDescription = `Discover ${vinyl.artist}'s album "${vinyl.album}"`
  const pageUrl = `https://vinylovers.vercel.app/vinyls/${encodeURIComponent(params.vinylArtist)}/${encodeURIComponent(params.vinylAlbum)}/${vinylId}`

  // Use the first attachment as the image or fallback to a default
  const originalImageUrl = vinyl.attachments[0]?.url || "https://vinylovers.vercel.app/logo192.png"

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: "music.album",
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: originalImageUrl,
          width: 1200,
          height: 630,
          alt: `${vinyl.artist} - ${vinyl.album} vinyl cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [originalImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// 🚀 Page Component
export default async function Page({ params }: PageProps) {
  const { vinylArtist, vinylAlbum, vinylId } = params
  const { user } = await validateRequest()
  const vinyl = await getVinyl(vinylId, user?.id)

  const pageUrl = `https://vinylovers.vercel.app/vinyls/${encodeURIComponent(vinylArtist)}/${encodeURIComponent(vinylAlbum)}/${vinylId}`
  const imageUrl = vinyl.attachments[0]?.thumbnailUrl || "https://vinylovers.vercel.app/logo192.png"

  return (
    <main className="flex w-full min-w-0 gap-5">
      {/* Add JSON-LD structured data */}
      <MusicAlbumJsonLd
        album={vinyl.album}
        artist={vinyl.artist}
        // releaseDate={vinyl.releaseDate}
        genre={vinyl.genre?.name}
        imageUrl={imageUrl}
        url={pageUrl}
      />

      <div className="w-full min-w-0 space-y-5">
        <Vinyl vinyl={vinyl} />
      </div>

      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={vinyl.user} />
        </Suspense>
        <VinylAffiliate className="mt-5" artist={vinyl.artist} vinylTitle={vinyl.album} />
      </div>
    </main>
  )
}

// Sidebar Component
interface UserInfoSidebarProps {
  user: UserData
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest()

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
        <h2 className="text-xl font-semibold">{user.displayName}</h2>
      </div>
      {user.bio && <p className="text-sm font-semibold">{user.bio}</p>}

      {!loggedInUser ? (
        <Link href="/login">
          <Button className="w-full mt-5 text-white bg-primary hover:bg-primary/80">Sign in to follow</Button>
        </Link>
      ) : (
        user.id !== loggedInUser.id && (
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(({ followerId }) => followerId === loggedInUser.id),
            }}
          />
        )
      )}
    </div>
  )
}

