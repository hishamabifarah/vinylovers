import { validateRequest } from "@/auth";
import AddVinylForm from "./AddVinylForm";
import prisma from "@/lib/prisma";

export default async function Page() {

  const { user } = await validateRequest();
  
  if (!user || !user.verified) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const genres = await prisma.genre.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
  return (
    <main className="flex h-screen p-1 w-full">
      <div className="flex h-full max-h-[40rem]  w-full overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-4">
          <h1 className="text-center text-3xl font-bold">Add New Vinyl</h1>
          <div className="space-y-5">
            <AddVinylForm genres={genres} />
          </div>
        </div>
      </div>
    </main>
  );
}
