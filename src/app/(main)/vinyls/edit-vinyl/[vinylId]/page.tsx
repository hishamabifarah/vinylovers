import { getVinylDataInclude } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import EditVinylForm from "@/components/vinyls/EditVinylForm";

const getVinyl = cache(async (vinylId: string, loggedInUserId: string) => {
    const vinyl = await prisma.vinyl.findUnique({
        where: {
            id: vinylId,
        },
        include: getVinylDataInclude(loggedInUserId),
    });

    if (!vinyl) return notFound();

    return vinyl;
});

export async function generateMetadata({ params: { vinylId } }: PageProps) {
    const { user } = await validateRequest();

    if (!user) return {};

    const vinyl = await getVinyl(vinylId, user.id);

    return {
        title: `Edit Vinyl : ${vinyl.artist} - ${vinyl.album}`,
    };
}

async function getGenres() {
    const genres = await prisma.genre.findMany({
        select: {
            id: true,
            name: true,
            thumbnail: true,
            vinyls: {
                select: { id: true }
            }
        },
        orderBy: {
            name: 'asc'
        }
    })
    return genres.map(genre => ({
        ...genre,
        vinylCount: genre.vinyls.length
    }))
}

interface PageProps {
    params: { vinylId: string };
}

export default async function EditVinylPage({ params }: PageProps) {
    const { user } = await validateRequest();
    
    if (!user) {
        // Handle unauthenticated users
        return notFound();
    }
    
    // Fetch vinyl data
    const vinyl = await getVinyl(params.vinylId, user.id);
    
    // Check if user is authorized to edit this vinyl
    if (vinyl.user.id !== user.id) {
        // Handle unauthorized access
        return notFound();
    }
    
    // Fetch genres
    const genres = await getGenres();

    return (
        <main className="flex h-screen p-1 w-full">
            <div className="flex h-full max-h-[40rem]  w-full overflow-hidden rounded-2xl bg-card shadow-2xl">
                <div className="w-full space-y-10 overflow-y-auto p-4">
                    <h1 className="text-center text-3xl font-bold">Edit Vinyl</h1>
                    <EditVinylForm vinylId={params.vinylId} vinyl={vinyl} genres={genres} />
                </div>
            </div>
        </main>
    );
}