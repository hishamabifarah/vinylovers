// import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import logo from "@/assets/logo192.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="dark:bg-customNavbar sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <div className="flex items-center justify-center">
          <Image src={logo} alt="" className="mt-2 h-10 w-10" />
          <Link href="/" className="ml-2 text-2xl font-bold text-primary">
            Vinylovers
          </Link>
        </div>
        {/* <SearchField /> */}
        {/* <PlusIcon className="bg-secondary rounded-full p-y-3"/> */}
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search albums, artists, users..."
            className="w-64"
          />
          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}
