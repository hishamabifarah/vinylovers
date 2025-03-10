import { Prisma } from "@prisma/client";

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getUserDataVinylSelect() {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    _count: {
      select: {
        vinyls:true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        vinyls:true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.PostInclude;
}



export function getVinylGenreDataInclude() {
  return {
    user: true,
    attachments:true,
    likes: {
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
      },
    },
    genre: {
      select: {
        id: true,
        name: true
      }
    },
  } satisfies Prisma.VinylInclude;
}

export function getVinylDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments:true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks:{
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
      },
    },
    genre: {
      select: {
        id: true,
        name: true
      }
    },
  } satisfies Prisma.VinylInclude;
}

export function getVinylFeaturedDataInclude() {
  return {
    user: {
      select: getUserDataVinylSelect(),
    },
  } satisfies Prisma.VinylInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type VinylData = Prisma.VinylGetPayload<{
  include: ReturnType<typeof getVinylDataInclude>;
}>;

export type VinylGenreData = Prisma.VinylGetPayload<{
  include: ReturnType<typeof getVinylGenreDataInclude>;
}>;

export type VinylFeaturedData = Prisma.VinylGetPayload<{
  include: ReturnType<typeof getVinylFeaturedDataInclude>;
}>;


export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface VinylsPage {
  vinyls: VinylData[];
  nextCursor: string | null;
}

export interface VinylsGenrePage {
  vinyls: VinylGenreData[];
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

export const vinylDataInclude = {
  user: {
    select: userDataSelect,
  },
  attachments: true,
} satisfies Prisma.VinylInclude;

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

