import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";
import slugify from "slugify";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  let vinylArtist = '';
  let vinylAlbum = '';
  if (notification.vinyl) {
    vinylArtist = slugify(notification.vinyl.artist, { lower: true, strict: true });
    vinylAlbum = slugify(notification.vinyl.album, { lower: true, strict: true });
  }

  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} followed you`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your vinyl`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/vinyls/${notification.vinylId}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} liked your vinyl`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/vinyls/${vinylArtist}/${vinylAlbum}/${notification.vinylId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.vinyl && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.vinyl.artist} - {notification.vinyl.album}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}