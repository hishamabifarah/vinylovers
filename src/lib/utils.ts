import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  const dateObject = new Date(from);
  if (currentDate.getTime() - dateObject.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === dateObject.getFullYear()) {
      return formatDate(dateObject, "MMM d");
    } else {
      return formatDate(dateObject, "MMM d, yyyy");
    }
  }
}

export function getMediaUrl(url: string): string {
  if (!url) return ""

  // If we're in production, ensure we're using the correct format
  if (process.env.NODE_ENV === "production") {
    // If the URL contains /a/{appId}, transform it to the correct format
    if (url.includes(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}`)) {
      return url.replace(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`, "/f/")
    }
  }

  return url
}
