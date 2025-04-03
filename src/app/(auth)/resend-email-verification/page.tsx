import { Metadata } from "next";
import ResendEmailVerificationForm from "./ResendEmailVerificationForm";
import NavbarDefault from "@/components/navigation/NavbarDefault";

export const metadata: Metadata = {
  title: "Resend Email Verification",
};

export default function Page() {
  return (
    <>
    <NavbarDefault/>
    <main className="flex h-screen  justify-center p-5">
      <div className="flex h-full max-h-[32rem] w-full max-w-[48rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10">
          <h1 className="text-center text-3xl font-bold">Resend Email Verification</h1>
          <div className="space-y-5">
            <ResendEmailVerificationForm />
          </div>
        </div>
      </div>
    </main>
    </>
  );
}