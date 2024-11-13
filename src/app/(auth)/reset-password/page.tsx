import { Metadata } from "next";
import ResetPasswordForm from "../reset-password-email/ResetPasswordForm";
import ResetPasswordEmailForm  from "./ResetPasswordEmailForm";
import NavbarDefault from "@/components/navigation/NavbarDefault";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function Page() {
  return (
    <>
    <NavbarDefault/>
    <main className="flex h-screen  justify-center p-5">
      <div className="flex h-full max-h-[32rem] w-full max-w-[48rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10">
          <h1 className="text-center text-3xl font-bold">Reset Password</h1>
          <div className="space-y-5">
            <ResetPasswordEmailForm />
          </div>
        </div>
      </div>
    </main>
    </>
  );
}