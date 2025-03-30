import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getVinylData, getVinylDataInclude, VinylsPage, VinylsSearchPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get("q") || ""; // if no query, return empty string
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined; // if no cursor, return undefined

        const searchQuery = q.split(" ").join(" & "); //

        const pageSize = 10;

        // const { user } = await validateRequest();

        // if (!user) {
        //     return Response.json({ error: "Unauthorized" }, { status: 401 });
        // }

        // full text search postgresql
        const vinyls = await prisma.vinyl.findMany({
            where: {
                OR: [
                    {
                        artist: {
                            search: searchQuery,
                        },
                    },
                    {
                        hashtags: {
                            search: searchQuery,
                        },
                    },
                    {
                        album: {
                            search: searchQuery,
                        },
                    },
                    {
                        user: {
                            displayName: {
                                search: searchQuery,
                            },
                        },
                    },
                    {
                        user: {
                            username: {
                                search: searchQuery,
                            },
                        },
                    },
                ],
            },
            include: getVinylData(),
            orderBy: { createdAt: "desc" },
            take: pageSize + 1,
            cursor: cursor ? { id: cursor } : undefined,
        });

        const nextCursor = vinyls.length > pageSize ? vinyls[pageSize].id : null;

        const data: VinylsSearchPage = {
            vinyls: vinyls.slice(0, pageSize),
            nextCursor,
        };

        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}