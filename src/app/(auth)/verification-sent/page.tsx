import { Metadata } from "next";
import Link from "next/link";
import NavbarDefault from "@/components/navigation/NavbarDefault";
import logo from "@/assets/logo192.png";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Verificaiton Email Sent",
};

export default function Page() {
  return (
    <>
    <NavbarDefault />
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10">
        <Image src={logo} alt="Vinylovers logo" className="mt-2 h-10 w-10 m-auto" />
          <h1 className="text-center text-3xl font-bold">Check Your Email</h1>
          <div className="space-y-5">
                <p className="mt-2 text-center">
                    We&apos;ve sent you a new verification email. Please check your inbox and spam folder.
                </p>          
            <Link  href="/login" className="block text-center hover:underline mt-3">
            Once verified, you can  log in here.</Link>

          </div>
        </div>
      </div>
    </main>
    </>
  );
}