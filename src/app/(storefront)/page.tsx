import { prisma } from "@/lib/prisma"; 
import VehicleCard from "@/components/storefront/VehicleCard";

// This tells Next.js to fetch fresh data every time someone visits the page
export const dynamic = "force-dynamic";

export default async function StorefrontPage() {
  // Fetch vehicles directly from your database
  // Note: If your database uses a different table name (like "vehicule" in French), 
  // you might need to change "prisma.vehicle" to match your schema.
  const vehicles = await prisma.vehicle.findMany();

  // If there are no cars in the database yet, show a friendly message
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-700">No cars found</h2>
        <p className="text-gray-500 mt-2">Check back later for available vehicles!</p>
      </div>
    );
  }

  // Display the cars in a responsive grid, exactly like Airbnb
  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Our Fleet</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {vehicles.map((vehicle: any) => (
          <VehicleCard 
            key={vehicle.id} 
            data={vehicle} 
          />
        ))}
      </div>
    </div>
  );
}