import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CarGallery from "@/components/storefront/CarGallery";
import BookingWidget from "@/components/storefront/BookingWidget";
import {
  Star, Users, Settings2, Fuel, Shield,
  MapPin, ChevronRight, Cigarette, Droplets, Mountain, MessageSquare
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Types & Helpers
───────────────────────────────────────────── */
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ start?: string; end?: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  ECONOMY: "Économique", COMFORT: "Confort",
  SUV: "SUV", LUXURY: "Luxe", VAN: "Utilitaire"
};
const FUEL_LABELS: Record<string, string> = {
  DIESEL: "Diesel", GASOLINE: "Essence",
  ELECTRIC: "Électrique", HYBRID: "Hybride"
};

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
async function getCar(id: string) {
  // 1. Fetch from Vehicle table
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle) return null;

  // 2. Fetch active reservations & rentals
  const reservations = await prisma.reservation.findMany({
    where: { vehicleId: id, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { startDate: true, endDate: true },
  });

  const rentals = await prisma.rental.findMany({
    where: { vehicleId: id, status: "ACTIVE" },
    select: { startDate: true, endDate: true },
  });

  return {
    ...vehicle,
    bookings: [...reservations, ...rentals],
    reviews: [], // Mock array to prevent crash since Review model isn't built yet
  };
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default async function CarDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const startDate = sp?.start;
  const endDate = sp?.end;

  const car = await getCar(id);
  if (!car) notFound();

  /* Mock Average Rating */
  const avgRating = 4.8;
  const price = car.dailyRate || 0;
  const categoryLabel = CATEGORY_LABELS[car.category] ?? car.category;

  /* Flatten all booked date ranges into individual dates */
  const bookedDates: string[] = [];
  car.bookings.forEach((b: any) => {
    let current = new Date(b.startDate);
    const end = new Date(b.endDate);
    while (current <= end) {
      bookedDates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  });

  /* 🟢 CORRECTION ANTI-CRASH: Image extraction */
  let images: string[] = [];
  if (typeof car.imageUrl === 'string' && car.imageUrl.trim() !== "") {
    try {
      const parsed = JSON.parse(car.imageUrl);
      if (Array.isArray(parsed)) {
        images = parsed;
      } else if (typeof parsed === 'string') {
        images = [parsed];
      }
    } catch {
      images = [car.imageUrl];
    }
  }
  // Remove any empty strings just in case
  images = images.filter(img => typeof img === 'string' && img.trim() !== "");

  const carName = `${car.brand} ${car.model} ${car.year}`;

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-0 mt-16 md:mt-0">
        <nav className="flex items-center gap-2 text-[12px] text-[#888] mb-6">
          <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <span className="text-[#0A0A0A] font-medium">{carName}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-32 lg:pb-10">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#888] bg-[#F0F0F0] px-2.5 py-1 rounded-full">
                {categoryLabel}
              </span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-[#0A0A0A]">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {avgRating.toFixed(1)}
                <span className="text-[#999] font-normal">(34 avis)</span>
              </span>
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#0A0A0A] tracking-tight leading-tight">
              {car.brand} {car.model} {car.year}
            </h1>
            <p className="flex items-center gap-1.5 text-[13px] text-[#888] mt-1">
              <MapPin size={12} />
              Agence Principale · Tanger, Maroc
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[30px] font-bold text-[#0A0A0A] leading-none tracking-tight">
              {price.toLocaleString("fr-MA")}
              <span className="text-[16px] font-medium text-[#888] ml-1">MAD</span>
            </p>
            <p className="text-[12px] text-[#aaa] mt-1">par jour</p>
          </div>
        </div>

        {/* ── Main layout: Gallery + Sidebar ── */}
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 items-start">
          {/* Left column */}
          <div className="space-y-8">

            {/* Gallery */}
            <CarGallery images={images} carName={carName} />

            {/* Specs strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Transmission", value: car.transmission === "AUTOMATIC" ? "Automatique" : "Manuelle", icon: Settings2 },
                { label: "Carburant", value: FUEL_LABELS[car.fuelType || ""] ?? car.fuelType, icon: Fuel },
                { label: "Places", value: `${car.seats} places`, icon: Users },
                { label: "Assurance", value: "Incluse", icon: Shield },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-xl border border-black/[0.07] p-4">
                  <Icon size={16} className="text-[#aaa] mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#aaa]">{label}</p>
                  <p className="text-[13px] font-semibold text-[#0A0A0A] mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.notes && (
              <div>
                <h2 className="text-[17px] font-bold text-[#0A0A0A] mb-3">À propos de ce véhicule</h2>
                <p className="text-[14px] text-[#555] leading-relaxed">{car.notes}</p>
              </div>
            )}

            {/* Rules */}
            <div>
              <h2 className="text-[17px] font-bold text-[#0A0A0A] mb-3">Règles de conduite</h2>
              <div className="bg-white rounded-2xl border border-black/[0.07] divide-y divide-black/[0.05]">
                {[
                  {
                    icon: Cigarette,
                    title: "Interdiction de fumer",
                    desc: "Frais de nettoyage de 500 MAD applicables.",
                    color: "text-red-400"
                  },
                  {
                    icon: Droplets,
                    title: "Garder le véhicule propre",
                    desc: "Frais de nettoyage potentiels en cas de saleté excessive.",
                    color: "text-blue-400"
                  },
                  {
                    icon: Mountain,
                    title: "Pas de conduite hors route",
                    desc: "Le véhicule est équipé de capteurs GPS. Dommages non couverts.",
                    color: "text-amber-400"
                  },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="flex items-start gap-4 p-4">
                    <Icon size={16} className={`${color} mt-0.5 shrink-0`} />
                    <div>
                      <p className="text-[13px] font-semibold text-[#0A0A0A]">{title}</p>
                      <p className="text-[12px] text-[#888] mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-[17px] font-bold text-[#0A0A0A] mb-1">Lieu de prise en charge</h2>
              <p className="text-[13px] text-[#888] mb-3">Agence Principale · Centre-ville, Tanger 90000</p>
              <div className="rounded-2xl overflow-hidden border border-black/[0.07] h-56 bg-[#E8E8E4] relative">
                <iframe
                  title="Localisation de l'agence"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-5.84%2C35.75%2C-5.78%2C35.80&layer=mapnik&marker=35.776%2C-5.808"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-transparent pointer-events-none hover:pointer-events-auto transition-all"></div>
              </div>
            </div>

            {/* Reviews (Mocked) */}
            <div className="pb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-[#0A0A0A]">
                  Notes et avis
                  <span className="ml-2 text-[14px] font-normal text-[#888]">
                    · ★ 4.8 (34)
                  </span>
                </h2>
              </div>

              <div className="bg-white rounded-2xl border border-black/[0.07] p-8 text-center">
                <MessageSquare size={24} className="text-[#ccc] mx-auto mb-3" />
                <p className="text-[13px] text-[#888] mb-4">Vous devez être connecté pour laisser un avis sur ce véhicule.</p>
                <Link href="/client-login" className="inline-block bg-[#0A0A0A] text-white px-6 py-2.5 rounded-full text-[13px] font-medium hover:bg-[#222] transition-colors">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Booking Widget (desktop) */}
          <div>
            <BookingWidget
              car={{
                id: car.id,
                name: carName,
                pricePerDay: price,
                isAvailable: car.status === "AVAILABLE",
              }}
              bookedDates={bookedDates}
              initialStart={startDate}
              initialEnd={endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}