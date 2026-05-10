import { prisma } from "@/lib/prisma";
import VehicleCard from "@/components/storefront/VehicleCard";
import HeroSearch from "@/components/storefront/HeroSearch";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StorefrontHomePage({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category as string | undefined;

  // 1. UPDATED QUERY: Only show cars that are AVAILABLE
  let query: any = {
    status: "AVAILABLE", // This filters for available cars only
  };
  
  if (category) query.category = category;

  const vehicles = await (prisma as any).vehicle.findMany({
    where: query,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full">
      
      {/* 2. TURO HERO BACKGROUND 
        Updated to use your fron-img.png from the public folder
      */}
      <div 
        className="w-full h-[500px] md:h-[600px] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center px-4 relative"
        style={{ backgroundImage: `url('/hero-bg.png')`, backgroundColor: '#1a1a1a' }}
      >
        {/* A subtle dark overlay to make the white text and search bar pop */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        <div className="relative z-10 w-full flex flex-col items-center mt-8">
          {/* Exact Turo Typography (White text over image) */}
          <h1 className="text-[56px] md:text-[80px] font-black text-white tracking-[-0.04em] leading-none mb-4 drop-shadow-md">
            Find your drive
          </h1>
          <p className="text-[18px] md:text-[24px] text-white font-semibold tracking-tight max-w-2xl mt-1 drop-shadow-md">
            Explore the world's largest car sharing marketplace
          </p>
          
          <div className="mt-10 w-full flex justify-center max-w-5xl">
             <HeroSearch />
          </div>
        </div>
      </div>

      {/* CAR GRID */}
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 mt-16">
        
        {/* Added a section title for the available cars */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
          Available Vehicles
        </h2>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 pb-20">
          
          {vehicles.length === 0 ? (
            <div className="col-span-full h-[30vh] flex flex-col items-center justify-center text-neutral-500">
              <h2 className="text-2xl font-semibold text-neutral-800">No cars available right now</h2>
              <p className="mt-2">Try changing your filters or checking back later.</p>
            </div>
          ) : (
            vehicles.map((vehicle: any) => (
              <VehicleCard key={vehicle.id} data={vehicle} />
            ))
          )}

        </div>
      </div>
    </div>
  );
}