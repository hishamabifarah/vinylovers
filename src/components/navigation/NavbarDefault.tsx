import Link from "next/link";
import logo from "@/assets/logo192.png";
import Image from "next/image";

export default function NavbarDefault() {
  return (
    <header className="dark:bg-customNavbar sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <div className="flex items-center justify-center">
          <Image src={logo} alt="" className="mt-2 h-10 w-10" />
          <Link href="/" className="ml-2 text-2xl font-bold text-primary">
            Vinylovers
          </Link>
        </div>
      </div>
    </header>
  );
}
