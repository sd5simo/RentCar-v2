"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, User, ChevronDown, MapPin, Calendar, Phone, LogIn } from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface NavbarProps {
  /** Pass the session user object from server component if you have auth */
  user?: { name: string; email: string } | null;
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [location, setLocation] = useState("Tanger");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (startDate) params.set("start", startDate);
    if (endDate) params.set("end", endDate);
    router.push(`/?${params.toString()}`);
    setSearchOpen(false);
  };

  const isHome = pathname === "/";

  return (
    <>
      {/* ── Main Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-black/[0.06] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <img 
              src="/logo.png" 
              alt="RentCar-OS Logo" 
              className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className="font-bold text-[16px] tracking-tight text-[#0A0A0A] hidden sm:block">
              RentCar-OS
            </span>
          </Link>

          {/* ── Desktop Center: compact search pill ── */}
          <div ref={searchRef} className="hidden md:block relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-200 border-black/10 bg-white hover:shadow-md text-[#0A0A0A]"
            >
              <MapPin size={14} className="opacity-70" />
              <span className="text-sm font-medium">{location}</span>
              <span className="w-px h-4 bg-current opacity-20" />
              <Calendar size={14} className="opacity-70" />
              <span className="text-sm opacity-70">
                {startDate || "Dates de location"}
              </span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center ml-1 transition-colors bg-[#0A0A0A] text-white">
                <Search size={12} />
              </div>
            </button>

            {/* Search Dropdown */}
            {searchOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[540px] bg-white rounded-2xl shadow-2xl border border-black/[0.06] p-4 z-50">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666] mb-1.5">Où</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full text-sm text-[#0A0A0A] border border-black/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#0A0A0A] transition-colors"
                      placeholder="Ville ou agence"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666] mb-1.5">Départ</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full text-sm text-[#0A0A0A] border border-black/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666] mb-1.5">Retour</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      className="w-full text-sm text-[#0A0A0A] border border-black/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#0A0A0A] text-white text-sm font-semibold rounded-xl py-3 hover:bg-[#222] transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={15} />
                  Rechercher
                </button>
              </div>
            )}
          </div>

          {/* ── Desktop Right ── */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="tel:+212600000000"
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-full transition-colors text-[#555] hover:text-[#0A0A0A] hover:bg-black/5"
            >
              <Phone size={13} />
              <span className="font-medium">+212 6 00 00 00 00</span>
            </a>

            {user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border transition-all border-black/10 text-[#0A0A0A] hover:bg-black/5"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0A0A0A] flex items-center justify-center text-white text-[10px] font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                  <ChevronDown size={12} className={`transition-transform ${userOpen ? "rotate-180" : ""}`} />
                </button>
                {userOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/[0.06] py-1 z-50">
                    <Link href="/reservations" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#333] hover:bg-black/[0.03] transition-colors">
                      Mes réservations
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#333] hover:bg-black/[0.03] transition-colors">
                      Mon profil
                    </Link>
                    <hr className="my-1 border-black/[0.06]" />
                    <button className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/client-login"
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all bg-[#0A0A0A] text-white hover:bg-[#222]"
              >
                <LogIn size={13} />
                Connexion
              </Link>
            )}
          </div>

          {/* ── Mobile: hamburger ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full transition-colors text-[#0A0A0A] hover:bg-black/5"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden transition-all duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`
            absolute top-16 left-0 right-0 bg-white shadow-xl
            transition-transform duration-300 ease-out
            ${mobileOpen ? "translate-y-0" : "-translate-y-4"}
          `}
        >
          {/* Mobile Search */}
          <div className="p-4 border-b border-black/[0.06]">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#888] mb-1.5">Où</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 text-sm border border-black/10 rounded-xl outline-none focus:border-[#0A0A0A] transition-colors"
                    placeholder="Ville ou agence"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#888] mb-1.5">Départ</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full text-sm border border-black/10 rounded-xl px-3 py-3 outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#888] mb-1.5">Retour</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="w-full text-sm border border-black/10 rounded-xl px-3 py-3 outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => { handleSearch(); setMobileOpen(false); }}
                className="w-full bg-[#0A0A0A] text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Search size={15} />
                Rechercher des véhicules
              </button>
            </div>
          </div>

          {/* Mobile Nav Links */}
          <nav className="p-4 space-y-1">
            {user && (
              <Link
                href="/reservations"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#333] hover:bg-black/[0.03] transition-colors"
              >
                Mes réservations
              </Link>
            )}
            <a
              href="tel:+212600000000"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#333] hover:bg-black/[0.03] transition-colors"
            >
              <Phone size={15} className="text-[#888]" />
              +212 6 00 00 00 00
            </a>
          </nav>

          {/* Mobile CTA */}
          <div className="p-4 pt-0">
            {user ? (
              <button className="w-full border border-red-200 text-red-500 font-semibold py-3 rounded-xl text-sm hover:bg-red-50 transition-colors">
                Déconnexion
              </button>
            ) : (
              <Link
                href="/client-login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-[#0A0A0A] text-white font-semibold py-3 rounded-xl text-sm"
              >
                <LogIn size={15} />
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to push content below fixed nav */}
      {!isHome && <div className="h-16" />}
    </>
  );
}