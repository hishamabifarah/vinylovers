"use client";

import { useSession } from "@/app/(main)/home/SessionProvider";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon ,Disc } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import UnverifiedUserButton from './UnverifiedUserButton';
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

interface UserButtonProps {
    className?: string;
  }

  export default function UserButton({ className }: UserButtonProps) {

    // get session from our provider because this is a client component we cant use validateRequest()
    // user and session from useSession are guaranteed not to be null, as long as we wrap app with sessionprovider it wont throw the error inside usession function
    const { user } = useSession();
    const { theme, setTheme } = useTheme();
    // const queryClient = useQueryClient();

    if(user && user?.verified){
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
                // queryClient.clear();
                logout();
              }}
            >
              <LogOutIcon className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }else{
      return (
        <UnverifiedUserButton/>
      )
    }
  }
