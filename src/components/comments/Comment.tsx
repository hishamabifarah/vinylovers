import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  return (
<div className="group/comment flex flex-wrap gap-3 py-3 relative">
  {/* User avatar */}
  <span className="flex-none">
    <UserTooltip user={comment.user}>
      <Link href={`/users/${comment.user.username}`}>
        <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
      </Link>
    </UserTooltip>
  </span>
  
  {/* Comment content */}
  <div className="flex-1 min-w-0">
    {/* Username and date */}
    <div className="flex flex-wrap items-center gap-1 text-sm">
      <UserTooltip user={comment.user}>
        <Link
          href={`/users/${comment.user.username}`}
          className="font-medium hover:underline"
        >
          {comment.user.displayName}
        </Link>
      </UserTooltip>
      <span className="text-muted-foreground">
        {formatRelativeDate(comment.createdAt)}
      </span>
    </div>
    
    {/* Comment text */}
    <div className="break-words">{comment.content}</div>
  </div>
  
  {/* More button (only for user's own comments) */}
  {comment.user.id === user?.id && (
    <CommentMoreButton
      comment={comment}
      className="absolute top-3 right-1 sm:static sm:ms-auto opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover/comment:opacity-100"
    />
  )}
</div>
  );
}