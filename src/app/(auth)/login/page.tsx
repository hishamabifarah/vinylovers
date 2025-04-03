import loginImage from "@/assets/signinrobot.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import NavbarDefault from "@/components/navigation/NavbarDefault";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <>
    <NavbarDefault />
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">Login to VinyLovers</h1>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
            <Link  href="/reset-password" className="block text-center hover:underline mt-3">
              Forgot Password?
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt="Smiling robot with a vinyl record that says Sing in"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
    </>
  );
}