
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getVinylDataInclude, VinylsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined; // get cursor from front

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vinyls = await prisma.vinyl.findMany({
      include: getVinylDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1, // get 11 because we need the last id of the post for next ten posts request
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = vinyls.length > pageSize ? vinyls[pageSize].id : null; // return id of last post if size > posts.length, else null

    const data: VinylsPage = {
      vinyls: vinyls.slice(0, pageSize), // return the pageSize only , we remove the 11th
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}