import { Metadata } from "next";
import Notifications from "./Notifications";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Page() {
  return (

        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <div className="">
              <Notifications />
            </div>
        </div>
  );
}