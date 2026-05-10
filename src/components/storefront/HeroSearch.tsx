"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [untilDate, setUntilDate] = useState("");
  
  const [activeDropdown, setActiveDropdown] = useState<"from" | "until" | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (location) router.push(`/?location=${location}`);
    else router.push(`/`);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "Add date";
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  // --- DARK GLASS CALENDAR (Kept this as requested!) ---
  const CustomCalendar = ({ onSelect, label }: { onSelect: (val: string) => void, label: string }) => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return (
      <div className="absolute top-[120%] left-0 w-[320px] p-5 bg-[#121214]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-50 animate-in fade-in zoom-in-95 duration-200">
        <div className="font-extrabold text-white text-lg mb-4 text-center drop-shadow-md">{label} • May 2026</div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-white/50 mb-2 uppercase tracking-widest">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          <div className="p-2"></div><div className="p-2"></div><div className="p-2"></div><div className="p-2"></div>
          {days.map((day) => (
            <button 
              key={day}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(`2026-05-${day.toString().padStart(2, '0')}`);
              }}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/30 transition text-[15px] font-bold text-white focus:outline-none drop-shadow-md"
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center mt-6 mb-12 px-4 relative z-20" ref={searchRef}>
      
      {/* THE TURO PILL: Solid White, Light Shadow */}
      <div className="flex flex-col md:flex-row items-center bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-neutral-200 w-full max-w-[850px] p-2 relative">
        
        {/* WHERE */}
        <div className="w-full md:flex-[1.5] rounded-full hover:bg-neutral-100 transition cursor-pointer pl-7 pr-4 py-2.5 flex flex-col justify-center">
          <label className="text-[10px] font-extrabold text-[#121214] tracking-widest uppercase block mb-[2px]">
            Where
          </label>
          <input 
            type="text" 
            placeholder="City, airport, address or hotel" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            // Text is dark again
            className="w-full bg-transparent outline-none text-[15px] text-[#121214] font-medium placeholder-neutral-500 truncate"
          />
        </div>

        {/* Light Gray Divider */}
        <div className="hidden md:block w-[1px] h-10 bg-neutral-200 mx-1"></div>

        {/* FROM */}
        <div 
          onClick={() => setActiveDropdown(activeDropdown === "from" ? null : "from")}
          className={`w-full md:flex-1 rounded-full transition cursor-pointer px-5 py-2.5 flex flex-col justify-center relative ${activeDropdown === "from" ? "bg-neutral-100 shadow-inner" : "hover:bg-neutral-100"}`}
        >
          <label className="text-[10px] font-extrabold text-[#121214] tracking-widest uppercase block mb-[2px]">
            From
          </label>
          <div className="flex flex-row items-center justify-between w-full">
            <span className={`text-[15px] font-medium truncate ${fromDate ? "text-[#121214]" : "text-neutral-500"}`}>
              {formatDisplayDate(fromDate)}
            </span>
            <svg className={`ml-2 text-neutral-600 transition-transform ${activeDropdown === "from" ? "rotate-180" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {activeDropdown === "from" && (
            <CustomCalendar label="Pick-up Date" onSelect={(val) => { setFromDate(val); setActiveDropdown("until"); }} />
          )}
        </div>

        {/* Light Gray Divider */}
        <div className="hidden md:block w-[1px] h-10 bg-neutral-200 mx-1"></div>

        {/* UNTIL */}
        <div 
          onClick={() => setActiveDropdown(activeDropdown === "until" ? null : "until")}
          className={`w-full md:flex-1 rounded-full transition cursor-pointer px-5 py-2.5 flex flex-col justify-center relative ${activeDropdown === "until" ? "bg-neutral-100 shadow-inner" : "hover:bg-neutral-100"}`}
        >
          <label className="text-[10px] font-extrabold text-[#121214] tracking-widest uppercase block mb-[2px]">
            Until
          </label>
          <div className="flex flex-row items-center justify-between w-full">
            <span className={`text-[15px] font-medium truncate ${untilDate ? "text-[#121214]" : "text-neutral-500"}`}>
              {formatDisplayDate(untilDate)}
            </span>
            <svg className={`ml-2 text-neutral-600 transition-transform ${activeDropdown === "until" ? "rotate-180" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {activeDropdown === "until" && (
            <CustomCalendar label="Drop-off Date" onSelect={(val) => { setUntilDate(val); setActiveDropdown(null); }} />
          )}
        </div>

        {/* SEARCH BUTTON */}
        <div className="ml-1 md:ml-2">
          <button 
            onClick={handleSearch}
            className="bg-[#593cfb] hover:bg-[#482ee6] transition h-14 w-14 rounded-full flex items-center justify-center text-white flex-shrink-0"
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '18px', width: '18px', stroke: 'currentcolor', strokeWidth: '4', overflow: 'visible' }}>
              <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}