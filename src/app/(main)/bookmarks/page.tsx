import { Metadata } from "next";
import Bookmarks from "./Bookmarks";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function Page() {
  return (

        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
            <div className="">
              <Bookmarks />
            </div>
        </div>

  );
}