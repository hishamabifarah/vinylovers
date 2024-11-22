import { VinylShelf } from '@/components/VinylShelf'
// import { prisma } from '@/lib/prisma'
// import { getCurrentUser } from '@/lib/session'

export default async function CollectionPage() {
//   const user = await getCurrentUser()
//   if (!user) {
//     return <div>Please log in to view your collection.</div>
//   }

//   const vinyls = await prisma.vinyl.findMany({
//     where: { userId: user.id },
//     select: {
//       id: true,
//       album: true,
//       artist: true,
//       thumbnail: true,
//     },
//     orderBy: { createdAt: 'desc' },
//   })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Vinyl Collection</h1>
      {/* <VinylShelf vinyls={vinyls} /> */}
    </div>
  )
}
