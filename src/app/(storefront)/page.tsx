import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import StorefrontClient, { Car } from "@/components/storefront/StorefrontClient";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface PageProps {
  searchParams?: Promise<{
    location?: string;
    start?: string;
    end?: string;
    category?: string;
  }>;
}

/* ─────────────────────────────────────────────
   Data Fetching
───────────────────────────────────────────── */
async function getCars(start?: string, end?: string): Promise<Car[]> {
  let bookedCarIds: string[] = [];

  // 1. Chercher les conflits dans les Réservations et Locations (Noms corrigés !)
  if (start && end) {
    const reservations = await prisma.reservation.findMany({
      where: {
        status: { in: ["CONFIRMED", "PENDING"] },
        OR: [{ startDate: { lte: new Date(end) }, endDate: { gte: new Date(start) } }],
      },
      select: { vehicleId: true },
    });

    const rentals = await prisma.rental.findMany({
      where: {
        status: "ACTIVE",
        OR: [{ startDate: { lte: new Date(end) }, endDate: { gte: new Date(start) } }],
      },
      select: { vehicleId: true },
    });

    bookedCarIds = [...reservations.map((r: any) => r.vehicleId), ...rentals.map((r: any) => r.vehicleId)];
  }

  // 2. Fetch depuis la table VEHICLE (et non car)
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return vehicles.map((car: any) => {
    const isUnavailableForDates = bookedCarIds.includes(car.id);

    return {
      id: car.id,
      name: `${car.brand} ${car.model} ${car.year}`,
      brand: car.brand,
      model: car.model,
      year: car.year,
      category: car.category,
      pricePerDay: car.dailyRate, // Adapté à votre schéma
      seats: car.seats,
      transmission: car.transmission,
      fuel: car.fuelType || car.fuel,
      imageUrl: car.imageUrl ?? null,
      isAvailable: car.status === "AVAILABLE" && !isUnavailableForDates,
      rating: 4.8, // Données factices en attendant la table Review
      reviewCount: 34,
    };
  });
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const location = params?.location;
  const start = params?.start;
  const end = params?.end;

  const cars = await getCars(start, end);

  return (
    <Suspense fallback={<HomeSkeleton />}>
      <StorefrontClient
        cars={cars}
        initialSearch={{ location, start, end }}
      />
    </Suspense>
  );
}

/* ─────────────────────────────────────────────
   Loading skeleton
───────────────────────────────────────────── */
function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <div className="h-[85vh] bg-[#0A0A0A] animate-pulse" />
      <div className="h-12 bg-[#111] animate-pulse" />
      <div className="h-14 bg-white border-b border-black/[0.06] animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="h-7 w-56 bg-black/5 rounded-lg mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-black/[0.07] animate-pulse">
              <div className="aspect-[4/3] bg-[#F0F0F0]" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#F0F0F0] rounded w-3/4" />
                <div className="h-3 bg-[#F0F0F0] rounded w-1/2" />
                <div className="h-3 bg-[#F0F0F0] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}