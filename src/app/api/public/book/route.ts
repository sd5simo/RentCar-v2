import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleId, startDate, endDate, totalAmount, firstName, lastName, phone } = body;

    if (!vehicleId || !startDate || !endDate || !firstName || !lastName || !phone) {
        return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    // 1. Find the client by phone
    let client = await prisma.client.findFirst({
        where: { phone }
    });

    // 2. If client doesn't exist, create them
    if (!client) {
        const randomCin = `GUEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        client = await prisma.client.create({
            data: {
                cin: randomCin, 
                firstName,
                lastName,
                phone,
                email: `${firstName.toLowerCase().replace(/\s/g, '')}@guest.com`,
            }
        });
    }

    // 3. Generate a unique reference code
    const refCode = `RES-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 4. Create the Reservation
    const reservation = await prisma.reservation.create({
        data: {
            refCode: refCode,
            vehicleId: vehicleId,
            clientId: client.id,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalAmount: Number(totalAmount),
            status: 'PENDING',
        }
    });

    return NextResponse.json({ success: true, reservation });

  } catch (error: any) {
    console.error("[PUBLIC_BOOKING_ERROR]", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}