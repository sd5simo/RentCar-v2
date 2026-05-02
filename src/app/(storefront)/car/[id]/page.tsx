// FIX 1: We added curly braces around { prisma }! 
import { prisma } from "@/lib/prisma"; 
import { notFound } from "next/navigation";
import BookingWidget from "@/components/storefront/BookingWidget";

// FIX 2: Next.js 15 requires params to be a Promise
interface CarPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CarDetailsPage({ params }: CarPageProps) {
  // FIX 3: We must await the params before using the ID
  const resolvedParams = await params;

  // Fetch the specific car from your database using the resolved ID
  const vehicle = await (prisma as any).vehicle.findUnique({
    where: {
      id: resolvedParams.id,
    },
  });

  // If someone types a random ID that doesn't exist, show a 404 page
  if (!vehicle) {
    return notFound();
  }

  // Build the Airbnb-style details layout
  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-10 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {vehicle.brand || "Brand"} {vehicle.model || "Model"}
        </h1>
        <p className="text-gray-500 mt-2">
          {vehicle.category || "Category"} • {vehicle.registrationNumber || "N/A"}
        </p>
      </div>

      {/* Main Image */}
      <div className="w-full h-[60vh] overflow-hidden rounded-xl bg-gray-200 mb-8 relative">
        {vehicle.imageUrl ? (
          <img 
            src={vehicle.imageUrl} 
            alt={`${vehicle.brand} ${vehicle.model}`} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-gray-500 bg-gray-100">
            No Image Available
          </div>
        )}
      </div>

      {/* Grid for Details (Left) and Reservation Box (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
        
        {/* Left Side: Car Details */}
        <div className="col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">About this car</h2>
            <p className="text-neutral-500">
              {vehicle.description || "No description provided for this vehicle."}
            </p>
          </div>
          
          <hr />

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Features</h2>
            <ul className="list-disc list-inside text-neutral-500 leading-relaxed">
               <li>Status: <span className="font-medium">{vehicle.status || "AVAILABLE"}</span></li>
               <li>Daily Rate: <span className="font-medium">${vehicle.dailyRate || vehicle.price || vehicle.prix || 0} / day</span></li>
            </ul>
          </div>
        </div>

        {/* Right Side: The Reservation Calendar Widget */}
        <div className="col-span-3 order-first md:order-last mb-10 md:mb-0">
          <BookingWidget 
            vehicleId={vehicle.id} 
            dailyRate={vehicle.dailyRate || vehicle.price || vehicle.prix || 0} 
          />
        </div>

      </div>
    </div>
  );
}