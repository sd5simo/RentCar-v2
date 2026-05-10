"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface CategoryBoxProps {
  label: string;
  selected?: boolean;
}

export default function CategoryBox({ label, selected }: CategoryBoxProps) {
  const router = useRouter();
  const params = useSearchParams();

  // This handles adding the category to the URL safely
  const handleClick = useCallback(() => {
    let currentQuery = {};
    
    if (params) {
      currentQuery = Object.fromEntries(params.entries());
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label
    };

    // If they click the same category again, it turns the filter off
    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }

    const url = new URLSearchParams(updatedQuery).toString();
    router.push(`/?${url}`);
  }, [label, params, router]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
        ${selected ? "border-neutral-800 text-neutral-800" : "border-transparent text-neutral-500"}
      `}
    >
      {/* We will just use text for now to keep it clean, but you can add icons later! */}
      <div className="font-medium text-sm">
        {label}
      </div>
    </div>
  );
}