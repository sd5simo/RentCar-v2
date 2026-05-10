"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="w-full bg-white z-10 border-b-[1px] border-neutral-200">
      <div className="py-4">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          <div className="flex flex-row items-center justify-between">
            
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="font-black text-[22px] tracking-tighter text-[#121214]">
                RentCar
              </div>
            </Link>

            {/* Exact Turo Right Menu */}
            <div className="flex flex-row items-center gap-2 md:gap-4">
              <button 
                onClick={() => router.push("/login")}
                className="hidden md:block text-[15px] font-semibold text-[#121214] py-2 px-4 rounded-full hover:bg-neutral-100 transition"
              >
                Become a host
              </button>
              
              {/* Profile Pill (Hamburger + Avatar) */}
              <div 
                onClick={() => router.push("/login")}
                className="p-2 border-[1px] border-neutral-300 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition bg-white"
              >
                <svg className="ml-1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: '#121214', strokeWidth: '3', overflow: 'visible' }}>
                  <g fill="none" fillRule="nonzero"><path d="m2 16h28"></path><path d="m2 24h28"></path><path d="m2 8h28"></path></g>
                </svg>
                <div className="bg-[#717171] text-white rounded-full h-8 w-8 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentcolor' }}>
                    <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}