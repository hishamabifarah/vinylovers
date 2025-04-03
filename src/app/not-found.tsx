// pages/404.js
import Image from 'next/image';
import Link from 'next/link';
import loginImage from "@/assets/sadrobot.jpg";
import { Metadata } from "next";
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';


export const metadata: Metadata = {
    title: "Page Not Found",
};

export default function Custom404() {
    return (
        <>
            <main className="flex justify-center p-4">
                <div className="flex   w-full max-w-[48rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
                    <div className="w-full space-y-10 overflow-y-auto p-4">
                        <h1 className="text-center text-3xl font-bold">Page Not Found</h1>
                        <div className="space-y-5">
                            <div className="flex flex-col items-center">
                                <div className="relative w-96 h-96 mb-6">
                                    <Image
                                        src={loginImage}
                                        alt="Sad Robot"
                                        layout="fill"
                                        objectFit="contain"
                                        priority
                                    />
                                </div>

                                <p className="text-center  mb-8">
                                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                                </p>

                                <div className="flex gap-4">
                                    <BackButton className="text-white flex items-center justify-start gap-3">
                                        Go Back
                                    </BackButton>


                                    <Link aria-label='Go Home' href="/">
                                        <Button
                                            className=" text-white flex items-center justify-start gap-3"

                                        >
                                            Go Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}