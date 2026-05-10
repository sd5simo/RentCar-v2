"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Categories from "./Categories";

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="w-full bg-white z-10 shadow-sm border-b-[1px]">
      <div className="py-4 border-b-[1px]">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="font-bold text-2xl text-rose-500">
                RentCar
              </div>
            </Link>

            {/* Admin Login Button */}
            <div className="flex flex-row items-center gap-3">
              <button 
                onClick={() => router.push("/login")}
                className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
              >
                Admin Login
              </button>
            </div>

          </div>
        </div>
      </div>
      
      {/* The Category Filter Bar */}
      <Categories />
      
    </div>
  );
}