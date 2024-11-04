import logo from "@/assets/viny.png";

import Image from "next/image";
import Link from "next/link";

export default function Page() {

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

        <div className="bg-custom-black absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center">
          <div className="custom-logo p-5">
            <Image src={logo} alt="vinylovers" className="w-[512px]" />
          </div>
          <h1 className="pb-6 text-4xl text-primary text-center" >
            <strong>Welcome to vinylovers.net</strong>
          </h1>
          <p className="text-center text-3xl text-primary">
            the ultimate online community for vinyl enthusiasts around the
            world.
          </p>

          <Link href="/signup" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Sign up
            </Link>
            
          <Link href="/login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Sign In
            </Link>
            
          <Link href="/home" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Home
            </Link>
        </div>
      </div>
    </div>
  );
}
