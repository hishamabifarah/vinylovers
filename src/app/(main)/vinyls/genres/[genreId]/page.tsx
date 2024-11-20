import prisma from "@/lib/prisma";
import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import GenreVinyls from "./GenreVinyls";

interface PageProps {
  params: { genreId: string };
}

export async function generateMetadata({
  params: { genreId },
}: PageProps): Promise<Metadata> {
  const genre = await getGenre(genreId);

  return {
    title: `${genre.name} - Genre`,
  };
}

const getGenre = cache(async (genreId: string) => {
  const genre = await prisma.genre.findFirst({
    where: {
      id: {
        equals: genreId,
        mode: "insensitive",
      },
    },
  });

  if (!genre) notFound();

  return genre;
});

export default async function Page({ params: { genreId } }: PageProps) {
  const genre = await getGenre(genreId);
    return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Vinyls labelled {genre.name}</h2>
    <div className="">
      <GenreVinyls genreId={genreId} />
    </div>
  </div>
  );
}
