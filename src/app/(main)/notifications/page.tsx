import { Metadata } from "next";
import Notifications from "./Notifications";
import { validateRequest } from "@/auth";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function Page() {
  const { user } = await validateRequest();

  if (!user || !user.verified) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  return (

    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
      <div className="">
        <Notifications />
      </div>
    </div>
  );
}