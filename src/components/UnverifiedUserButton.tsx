"use client";

import { cn } from "@/lib/utils";
import { Check, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
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

    const { theme, setTheme } = useTheme();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn("flex-none rounded-full", className)}>
              {/* <UserAvatar avatarUrl={UserDefaultAvatar} size={40} /> */}
              <UserAvatar size={40} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <Link href='/login'>
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-4" />
                Profile
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
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  