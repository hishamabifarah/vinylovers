"use client";

import { VinylData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import VinylMoreButton from "./VinylMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";

interface PostProps {
  vinyl: VinylData;
}

export default function Vinyl({ vinyl }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${vinyl.user.username}`}>
            <UserAvatar avatarUrl={vinyl.user.avatarUrl} />
          </Link>
          <div>
            <Link
              href={`/users/${vinyl.user.username}`}
              className="block font-medium hover:underline"
            >
              {vinyl.user.displayName}
            </Link>
            <Link
              href={`/vinyls/${vinyl.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(vinyl.createdAt)}
            </Link>
          </div>
        </div>
        {user && user.id === vinyl.user.id && (
          <VinylMoreButton
            vinyl={vinyl}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
        {/* {vinyl.user.id === user.id && (
          <VinylMoreButton
            vinyl={vinyl}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )} */}
      </div>
      <div className="whitespace-pre-line break-words">{vinyl.artist}</div>
    </article>
  );
}