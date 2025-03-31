import { Metadata } from "next";
import Chat from "./Chat";
import { validateRequest } from "@/auth";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  return <Chat />;
}