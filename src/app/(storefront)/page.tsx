import { prisma } from "@/lib/prisma";
import VehicleCard from "@/components/storefront/VehicleCard";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StorefrontHomePage({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category as string | undefined;

  // FIX: Start with an empty query so ALL cars from your admin panel show up
  let query: any = {};

  if (category) {
    query.category = category;
  }

  // Fetch the cars from the database
  const vehicles = await (prisma as any).vehicle.findMany({
    where: query,
    orderBy: {
      createdAt: 'desc' 
    }
  });

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        
        {vehicles.length === 0 ? (
          <div className="col-span-full h-[50vh] flex flex-col items-center justify-center text-neutral-500">
            <h2 className="text-2xl font-semibold text-neutral-800">No cars found</h2>
            <p className="font-light mt-2">Try selecting a different category.</p>
          </div>
        ) : (
          vehicles.map((vehicle: any) => (
            <VehicleCard key={vehicle.id} data={vehicle} />
          ))
        )}

      </div>
    </div>
  );
}