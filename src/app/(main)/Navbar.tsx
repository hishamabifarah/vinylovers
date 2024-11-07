// import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import {PlusIcon} from 'lucide-react'
import logo from '@/assets/logo192.png';
import Image from "next/image";


export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm  dark:bg-customNavbar">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <div className="flex items-center justify-center">
          <Image src={logo} alt="" className="w-10 h-10 mt-2"/>
        <Link href="/" className="text-2xl font-bold text-primary ml-2">
          Vinylovers
        </Link>
        </div>   
        {/* <SearchField /> */}
        {/* <PlusIcon className="bg-secondary rounded-full p-y-3"/> */}
        <UserButton className="sm:ms-auto" />
     
      </div>
    </header>
  );
}