import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // The data coming from our BookingWidget
    const { vehicleId, startDate, endDate, clientName, clientPhone } = body;

    // Just in case Prisma wants a Number instead of a String for the ID!
    const formattedVehicleId = isNaN(Number(vehicleId)) ? vehicleId : Number(vehicleId);

    // We use (prisma as any) to temporarily bypass TypeScript's red squiggly lines 
    // so we can test if the database actually accepts it!
    const newReservation = await (prisma as any).reservation.create({
      data: {
        vehicleId: formattedVehicleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "PENDING", 
        // If your database requires client details, uncomment these:
        // clientName: clientName, 
        // clientPhone: clientPhone,
      }
    });

    return NextResponse.json(newReservation);

  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to create reservation." }, 
      { status: 500 }
    );
  }
}