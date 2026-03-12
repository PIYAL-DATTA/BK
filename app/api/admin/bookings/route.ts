import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';

// Simple auth check - in production, use proper JWT validation
function isAdmin(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.ADMIN_SECRET_KEY}`;
}

export async function GET(request: Request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const booking = new Booking({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      serviceName: body.serviceName,
      bookingDate: body.bookingDate,
      duration: body.duration,
      durationUnit: body.durationUnit,
      destination: body.destination,
      amount: body.amount,
      status: body.status || 'pending',
    });

    await booking.save();
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
