"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star, Shield, Clock, Phone, ChevronRight,
  SlidersHorizontal, X, Fuel, Users, Settings2,
  Bell, ArrowRight, Zap, Award, MapPin
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: "ECONOMY" | "COMFORT" | "SUV" | "LUXURY" | "VAN" | string;
  pricePerDay: number;
  seats: number;
  transmission: "MANUAL" | "AUTOMATIC" | string;
  fuel: "DIESEL" | "GASOLINE" | "ELECTRIC" | "HYBRID" | string;
  imageUrl?: string | null;
  isAvailable: boolean;
  rating?: number | null;
  reviewCount?: number;
}

interface StorefrontClientProps {
  cars: Car[];
  initialSearch?: { location?: string; start?: string; end?: string };
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const CATEGORIES: { value: string; label: string }[] = [
  { value: "ALL", label: "Tous" },
  { value: "ECONOMY", label: "Économique" },
  { value: "COMFORT", label: "Confort" },
  { value: "SUV", label: "SUV" },
  { value: "LUXURY", label: "Luxe" },
  { value: "VAN", label: "Utilitaire" },
];

const CATEGORY_COLORS: Record<string, string> = {
  ECONOMY: "bg-emerald-50 text-emerald-700",
  COMFORT: "bg-blue-50 text-blue-700",
  SUV: "bg-orange-50 text-orange-700",
  LUXURY: "bg-purple-50 text-purple-700",
  VAN: "bg-slate-100 text-slate-700",
};

const FUEL_LABELS: Record<string, string> = {
  DIESEL: "Diesel", GASOLINE: "Essence", ELECTRIC: "Électrique", HYBRID: "Hybride"
};

/* ─────────────────────────────────────────────
   Car Card
───────────────────────────────────────────── */
function CarCard({ car, startDate, endDate }: { car: Car; startDate?: string; endDate?: string }) {
  const [imgError, setImgError] = useState(false);
  const days = useMemo(() => {
    if (!startDate || !endDate) return null;
    const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    return diff > 0 ? Math.ceil(diff) : null;
  }, [startDate, endDate]);

  const total = days ? days * car.pricePerDay : null;
  const href = `/car/${car.id}${startDate ? `?start=${startDate}&end=${endDate}` : ""}`;

  // Sécurité d'extraction pour l'image
  let coverImage: string | null = null;
  if (typeof car.imageUrl === 'string' && car.imageUrl.trim() !== "") {
    try {
      const parsed = JSON.parse(car.imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        coverImage = parsed[0];
      } else if (typeof parsed === 'string') {
        coverImage = parsed;
      }
    } catch {
      coverImage = car.imageUrl;
    }
  }
  if (coverImage && coverImage.trim() === "") {
    coverImage = null;
  }

  return (
    <Link href={href} className="group block">
      <article
        className={`
          relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden
          ${car.isAvailable
            ? "border-black/[0.07] hover:border-black/20 hover:shadow-xl hover:-translate-y-1"
            : "border-black/[0.05] opacity-70"}
        `}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
          {coverImage && !imgError ? (
            <Image
              src={coverImage}
              alt={car.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`absolute inset-0 flex flex-col items-center justify-center
              ${car.category === "LUXURY" ? "bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
              : car.category === "SUV" ? "bg-gradient-to-br from-[#1a2a1a] to-[#0d1f0d]"
              : "bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]"}`}
            >
              <span className="text-4xl font-bold text-white/10 tracking-tighter">{car.brand.toUpperCase()}</span>
              <span className="text-white/30 text-sm mt-1">{car.model} {car.year}</span>
            </div>
          )}

          {!car.isAvailable && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white rounded-full px-3 py-1.5 shadow-sm border border-black/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs font-semibold text-[#333]">Indisponible</span>
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full backdrop-blur-sm ${CATEGORY_COLORS[car.category] || "bg-slate-100 text-slate-700"} bg-opacity-90`}>
              {car.category}
            </span>
          </div>

          {car.rating && car.isAvailable && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-[#0A0A0A]">{car.rating.toFixed(1)}</span>
              {car.reviewCount ? <span className="text-[10px] text-[#888]">({car.reviewCount})</span> : null}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888] mb-0.5">{car.brand}</p>
              <h3 className="font-semibold text-[15px] text-[#0A0A0A] leading-tight">{car.model} {car.year}</h3>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[18px] font-bold text-[#0A0A0A] leading-none">
                {car.pricePerDay.toLocaleString("fr-MA")}
                <span className="text-[11px] font-medium text-[#888] ml-0.5">MAD</span>
              </p>
              <p className="text-[10px] text-[#999] mt-0.5">/jour</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#777] mb-3">
            <span className="flex items-center gap-1"><Users size={11} />{car.seats} places</span>
            <span className="flex items-center gap-1"><Settings2 size={11} />{car.transmission === "AUTOMATIC" ? "Auto" : "Manuelle"}</span>
            <span className="flex items-center gap-1"><Fuel size={11} />{FUEL_LABELS[car.fuel] || car.fuel}</span>
          </div>

          {car.isAvailable ? (
            <div className="flex items-center justify-between">
              {total && days ? (
                <p className="text-[12px] text-[#555]">
                  <span className="font-semibold text-[#0A0A0A]">{total.toLocaleString("fr-MA")} MAD</span>
                  <span className="text-[#888]"> · {days} jour{days > 1 ? "s" : ""}</span>
                </p>
              ) : (
                <p className="text-[12px] text-[#888]">Sélectionnez les dates</p>
              )}
              <div className="w-8 h-8 rounded-full bg-[#0A0A0A] flex items-center justify-center group-hover:bg-[#333] transition-colors">
                <ArrowRight size={13} className="text-white" />
              </div>
            </div>
          ) : (
            <div
              role="button"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-black/20 text-[12px] font-medium text-[#555] hover:border-black/40 hover:text-[#0A0A0A] transition-colors cursor-pointer"
              onClick={e => { e.preventDefault(); alert("Notification activée ! Vous serez alerté dès que ce véhicule sera disponible."); }}
            >
              <Bell size={12} />
              Me notifier quand disponible
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function StorefrontClient({ cars, initialSearch }: StorefrontClientProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [transmissionFilter, setTransmissionFilter] = useState<"ALL" | "MANUAL" | "AUTOMATIC">("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  const startDate = initialSearch?.start;
  const endDate = initialSearch?.end;

  const absoluteMaxPrice = useMemo(() => Math.max(...cars.map(c => c.pricePerDay), 2500), [cars]);

  const filtered = useMemo(() => {
    return cars.filter(car => {
      if (activeCategory !== "ALL" && car.category !== activeCategory) return false;
      if (car.pricePerDay > maxPrice) return false;
      if (transmissionFilter !== "ALL" && car.transmission !== transmissionFilter) return false;
      return true;
    });
  }, [cars, activeCategory, maxPrice, transmissionFilter]);

  const available = filtered.filter(c => c.isAvailable);
  const unavailable = filtered.filter(c => !c.isAvailable);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const activeFilterCount = [
    activeCategory !== "ALL",
    maxPrice < absoluteMaxPrice,
    transmissionFilter !== "ALL"
  ].filter(Boolean).length;

  const today = new Date().toISOString().split("T")[0];
  const defaultEnd = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#F8F8F6]">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <div ref={heroRef} className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0A0A0A]">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/hero-bg.png" 
            alt="Location de voitures" 
            className="w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/60 border border-white/10 rounded-full px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Tanger · Maroc · Disponible maintenant
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-white font-bold leading-none tracking-tighter mb-5"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            Location de voitures<br />
            <span className="text-white/40">réinventée.</span>
          </h1>

          <p className="text-center text-white/50 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
            {cars.filter(c => c.isAvailable).length} véhicules disponibles. Réservez en 2 minutes, conduisez aujourd'hui.
          </p>

          {/* ── Glass Search Card ── */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
                <div className="bg-black/20 sm:bg-transparent p-4 rounded-xl sm:rounded-none">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/40 mb-1.5">
                    <MapPin size={9} className="inline mr-1" />Où
                  </label>
                  <input
                    defaultValue={initialSearch?.location || "Tanger"}
                    className="w-full bg-transparent text-white text-sm font-medium placeholder-white/30 outline-none"
                    placeholder="Ville ou agence"
                  />
                </div>
                <div className="bg-black/20 sm:bg-transparent p-4 rounded-xl sm:rounded-none">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/40 mb-1.5">
                    Départ
                  </label>
                  <input
                    suppressHydrationWarning={true}
                    type="date"
                    defaultValue={startDate || today}
                    min={today}
                    className="w-full bg-transparent text-white text-sm font-medium outline-none [color-scheme:dark]"
                  />
                </div>
                <div className="bg-black/20 sm:bg-transparent p-4 rounded-xl sm:rounded-none">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/40 mb-1.5">
                    Retour
                  </label>
                  <input
                    suppressHydrationWarning={true}
                    type="date"
                    defaultValue={endDate || defaultEnd}
                    min={startDate || today}
                    className="w-full bg-transparent text-white text-sm font-medium outline-none [color-scheme:dark]"
                  />
                </div>
              </div>
              <button className="mt-2 w-full bg-white text-[#0A0A0A] font-bold text-sm py-3.5 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                Rechercher des véhicules
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TRUST BANNER
      ══════════════════════════════════════ */}
      <div className="bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 text-[12px]">
            {[
              { icon: Shield, text: "Assurance incluse" },
              { icon: Clock, text: "Annulation gratuite 24h" },
              { icon: Award, text: "Véhicules certifiés" },
              { icon: Zap, text: "Confirmation instantanée" },
              { icon: Phone, text: "Support 24/7" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/70">
                <Icon size={13} className="text-white/40" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STICKY FILTER BAR
      ══════════════════════════════════════ */}
      <div
        ref={filterRef}
        className={`sticky top-16 z-30 bg-[#F8F8F6]/95 backdrop-blur-xl border-b border-black/[0.06] transition-shadow duration-200 ${!heroVisible ? "shadow-sm" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none">
          {/* Category pills */}
          <div className="flex items-center gap-2 shrink-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`
                  px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all
                  ${activeCategory === cat.value
                    ? "bg-[#0A0A0A] text-white shadow-sm"
                    : "bg-white border border-black/10 text-[#555] hover:border-black/30 hover:text-[#0A0A0A]"}
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-black/10 shrink-0 mx-1" />

          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap border transition-all shrink-0
              ${showFilters || activeFilterCount > 0
                ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                : "bg-white border-black/10 text-[#555] hover:border-black/30"}
            `}
          >
            <SlidersHorizontal size={12} />
            Filtres
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Results count */}
          <span className="ml-auto shrink-0 text-[12px] text-[#888] whitespace-nowrap">
            <span className="font-semibold text-[#0A0A0A]">{available.length}</span> disponible{available.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div className="border-t border-black/[0.06] bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-6 items-end">
              {/* Price range */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#888] mb-2">
                  Prix max — <span className="text-[#0A0A0A]">{maxPrice.toLocaleString("fr-MA")} MAD/jour</span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={absoluteMaxPrice}
                  step={50}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0A0A0A]"
                />
                <div className="flex justify-between text-[10px] text-[#aaa] mt-1">
                  <span>100 MAD</span>
                  <span>{absoluteMaxPrice.toLocaleString("fr-MA")} MAD</span>
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#888] mb-2">Transmission</label>
                <div className="flex gap-2">
                  {(["ALL", "AUTOMATIC", "MANUAL"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTransmissionFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all
                        ${transmissionFilter === t ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "border-black/10 text-[#555] hover:border-black/30"}`}
                    >
                      {t === "ALL" ? "Tous" : t === "AUTOMATIC" ? "Automatique" : "Manuelle"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setActiveCategory("ALL"); setMaxPrice(absoluteMaxPrice); setTransmissionFilter("ALL"); }}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-[#888] hover:text-red-500 transition-colors"
                >
                  <X size={13} />
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          CAR GRID
      ══════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Available */}
        {available.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[22px] font-bold text-[#0A0A0A] tracking-tight">Véhicules disponibles</h2>
                <p className="text-[13px] text-[#888] mt-0.5">Prêts à être réservés maintenant</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {available.map(car => (
                <CarCard key={car.id} car={car} startDate={startDate} endDate={endDate} />
              ))}
            </div>
          </section>
        )}

        {/* Unavailable */}
        {unavailable.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div>
                <h2 className="text-[20px] font-bold text-[#0A0A0A] tracking-tight">Prochainement disponibles</h2>
                <p className="text-[13px] text-[#888] mt-0.5">Activez une notification pour être alerté</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {unavailable.map(car => (
                <CarCard key={car.id} car={car} startDate={startDate} endDate={endDate} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-4">
              <SlidersHorizontal size={24} className="text-[#aaa]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0A0A0A] mb-2">Aucun véhicule trouvé</h3>
            <p className="text-[#888] text-sm max-w-xs">Essayez de modifier vos filtres pour voir plus de résultats.</p>
            <button
              onClick={() => { setActiveCategory("ALL"); setMaxPrice(absoluteMaxPrice); setTransmissionFilter("ALL"); }}
              className="mt-4 px-4 py-2 bg-[#0A0A0A] text-white text-sm font-medium rounded-full hover:bg-[#222] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>
    </div>
  );
}