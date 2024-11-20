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
  return <GenreVinyls genreId={genreId} />
}
