"use client";

import { usePathname } from "next/navigation";
import { CategoryFilter } from "./CategoryBox"; // Use named import

export default function Categories() {
  const pathname = usePathname();

  // We only want to show this bar on the main homepage, not on the car details page
  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="pt-4">
        <CategoryFilter />
      </div>
    </div>
  );
}