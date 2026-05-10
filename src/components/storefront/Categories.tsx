"use client";

import { useSearchParams, usePathname } from "next/navigation";
import CategoryBox from "./CategoryBox";

// Here are the categories for your rental agency. 
// You can change these words to match the exact 'category' names in your database!
export const categories = [
  { label: "Economy" },
  { label: "Compact" },
  { label: "SUV" },
  { label: "Luxury" },
  { label: "Electric" },
  { label: "Van" },
  { label: "Convertible" },
];

export default function Categories() {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  // We only want to show this bar on the main homepage, not on the car details page
  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox 
            key={item.label}
            label={item.label}
            selected={category === item.label}
          />
        ))}
      </div>
    </div>
  );
}