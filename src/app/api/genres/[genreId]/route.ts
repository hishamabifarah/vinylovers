import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getVinylGenreDataInclude, VinylsGenrePage, VinylsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { genreId } }: { params: { genreId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined; // get cursor from front

    const pageSize = 8;

    // const { user } = await validateRequest();

    // if (!user) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const vinyls = await prisma.vinyl.findMany({
      include: getVinylGenreDataInclude(),
      where: { genreId: genreId },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1, // get 9 because we need the last id of the vinyl for next ten vinyls request
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = vinyls.length > pageSize ? vinyls[pageSize].id : null; // return id of last vinyl if size > vinyls.length, else null

    const data: VinylsGenrePage = {
      vinyls: vinyls.slice(0, pageSize), // return the pageSize only , we remove the 11th
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}