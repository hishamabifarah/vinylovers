"use client";

import { useSearchParams } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import { Form } from "@/components/ui/form";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { verify } from "./actions";
import Image from "next/image";
import verifyImage from "@/assets/verifyrobot.jpg"

export default function Page() {
  const [error, setError] = useState<string>();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const form = useForm();

  async function onSubmit() {
    const token = searchParams.get("token");
    if (!token) {
      return <div>Invalid token</div>;
    }

    setError(undefined);
    startTransition(async () => {
      const { error } = await verify(token);
      if (error) setError(error);
    });
  }

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex justify-center items-center h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">
            Welcome to Vinylovers! 
         
          </h1>
          <h4 className="text-center">Please Verify Account</h4>
          <div className="space-y-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                {error && (
                  <p className="text-center text-destructive">{error}</p>
                )}
                <LoadingButton
                  loading={isPending}
                  type="submit"
                  className="w-full"
                >
                  Verify Account
                </LoadingButton>
              </form>
            </Form>
          </div>
        </div>
        <Image
          src={verifyImage}
          alt="Smiling robot with a vinyl record" 
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}