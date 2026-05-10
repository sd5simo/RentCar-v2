import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // The details we get from the BookingWidget
    const { vehicleId, startDate, endDate, clientName, clientPhone, dailyRate } = body;

    // 1. Calculate the Total Amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Calculate how many days they are renting
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
    
    // Calculate the total price
    const rate = Number(dailyRate) || 0; 
    const totalAmount = totalDays * rate;

    // 2. Handle the Client
    // We split the single name input into First and Last name
    const [firstName, ...lastNameParts] = (clientName || "Public").split(" ");
    const lastName = lastNameParts.join(" ") || "Client";

    // Because your database REQUIRES a 'cin' (ID Card), we generate a temporary one
    // so the booking doesn't crash. The admin can update it later!
    const tempCin = `PUB-${Date.now().toString().slice(-6)}`; 
    
    // Try to see if this customer already exists by phone number
    let client = await prisma.client.findFirst({
        where: { phone: clientPhone }
    });

    // If they don't exist, create a new client profile for them
    if (!client) {
        client = await prisma.client.create({
            data: {
                cin: tempCin, 
                firstName: firstName,
                lastName: lastName,
                phone: clientPhone || "0000000000",
            }
        });
    }

    // 3. Create the Reservation with ALL required fields
    const newReservation = await prisma.reservation.create({
      data: {
        refCode: `RES-${Date.now().toString().slice(-6)}`, // Generate a random Ref Code
        clientId: client.id,                               // Attach it to our new client
        vehicleId: vehicleId,
        startDate: start,
        endDate: end,
        totalAmount: totalAmount,                          // Required by DB
        status: "PENDING",                                 // Admin will approve it later
        notes: "Booked via Public Storefront",
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