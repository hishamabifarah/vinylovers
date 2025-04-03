"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon, Disc } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import UnverifiedUserButton from "./UnverifiedUserButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { useQueryClient } from "@tanstack/react-query";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
console.log('user', user);
  if (user) {
    if (user.verified) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn("flex-none rounded-full", className)}>
              <UserAvatar avatarUrl={user.avatarUrl} size={40} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/users/${user.username}`}>
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link href={"/vinyls/add-vinyl"}>
              <DropdownMenuItem>
                <Disc className="mr-2 size-4" />
                Add Vinyl
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Monitor className="mr-2 size-4" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 size-4" />
                    System default
                    {theme === "system" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 size-4" />
                    Light
                    {theme === "light" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 size-4" />
                    Dark
                    {theme === "dark" && <Check className="ms-2 size-4" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                queryClient.clear();
                logout();
              }}
            >
              <LogOutIcon className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <UnverifiedUserButton />
          <p className="text-sm text-red-500">Please verify your account.</p>
        </div>
      );
    }
  }

  // Guest users (not logged in)
  return (
    <Link href="/login">
        <p>Guest</p>
    </Link>
  );
}
