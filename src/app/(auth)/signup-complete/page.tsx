import signupImage from "@/assets/registerrobot.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NavbarDefault from "@/components/navigation/NavbarDefault";

export const metadata: Metadata = {
  title: "Sign Up Complete",
};

export default function Page() {
  return (
    <>
    <NavbarDefault/>
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-full">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to VinyLovers</h1>
            <p className="text-muted-foreground">
              A place for all vinyl records lovers
            </p>
          </div>
          </div>
      </div>
    </main>
    </>
  );
}