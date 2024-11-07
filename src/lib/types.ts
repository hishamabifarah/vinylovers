import { Prisma } from "@prisma/client";

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;


export const postDataInclude = {
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude;

// generate type for Post data that includes the user
export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
