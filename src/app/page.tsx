"use client";

import logo from "@/assets/viny.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };
  const handleSignupRedirect = () => {
    router.push("/signup");
  };
  const handleHomeRedirect = () => {
    router.push("/home");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-start">
      <div className="relative h-full w-full">
        <video
          src="/main.mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="h-full w-full object-cover"
        />

        <div className="p-4 absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center bg-custom-black">
          <Image src={logo} alt="vinylovers" className="mb-6 w-[512px]" />
          <h1 className="mb-4 text-4xl font-bold text-primary md:text-6xl text-center">
            Welcome to vinylovers.net
          </h1>
          <p className="mb-6 text-center text-lg text-primary md:text-xl p-2">
            the ultimate online community for vinyl enthusiasts around the
            world.
          </p>
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <button
              onClick={handleLoginRedirect}
              className="hover:bg-primary-dark rounded bg-primary px-8 py-4 text-white transition duration-300"
            >
              Login
            </button>
            <button
              onClick={handleSignupRedirect}
              className="hover:bg-primary-dark rounded bg-primary px-8 py-4 text-white transition duration-300"
            >
              Sign up
            </button>
            <button
              onClick={handleHomeRedirect}
              className="hover:bg-primary-dark rounded bg-primary px-8 py-4 text-white transition duration-300"
            >
              Check it out!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
