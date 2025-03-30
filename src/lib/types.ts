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
    following: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followingId: true,
      },
    },
    _count: {
      select: {
        vinyls:true,
        followers: true,
        following: true
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

export function getVinylData() {
  return {
    user: {
      select: getUserDataVinylSelect(),
    },
    attachments:true,
    _count: {
      select: {
        likes: true,
        comments: true
      },
    },
    genre: {
      select: {
        id: true,
        name: true
      }
    },
    likes: true,
    bookmarks: true,
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
        comments: true
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

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  vinyl: {
    select: {
      artist: true,
      album: true
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  commentsCount: number;
  previousCursor: string | null; // comments are navigated backwards
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type VinylData = Prisma.VinylGetPayload<{
  include: ReturnType<typeof getVinylDataInclude>;
}>;

export type VinySearchlData = Prisma.VinylGetPayload<{
  include: ReturnType<typeof getVinylData>;
}>;

export type FollowingData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
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

export interface VinylsSearchPage {
  vinyls: VinySearchlData[];
  nextCursor: string | null;
}

export interface FollowingPage {
  following: FollowingData[];
  nextCursor: string | null;
}

export interface FollowersPage {
  followers: FollowingData[];
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

export interface FollowersInfo {
  followers: number;
  username: string;
  isFollowedByUser: boolean;
}

export interface FollowingInfo {
  following: number;
  username: string;
  // isFollowedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface CommentsInfo {
  comments: number;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

