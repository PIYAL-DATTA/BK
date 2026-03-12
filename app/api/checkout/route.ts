import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const { bookingData } = body;

    console.log('Creating booking with data:', bookingData);

    // Create booking in database
    const booking = await Booking.create({
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      bookingDate: bookingData.bookingDate,
      amount: bookingData.amount,
      duration: bookingData.duration,
      durationUnit: bookingData.durationUnit,
      destination: bookingData.destination,
      hourlyRate: bookingData.hourlyRate,
      status: 'pending',
    });

    console.log('Booking created:', booking._id);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'bdt',
            product_data: {
              name: bookingData.serviceName,
              description: `Booking for ${bookingData.customerName}`,
            },
            unit_amount: bookingData.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      customer_email: bookingData.customerEmail,
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    console.log('Stripe session created:', session.id);

    // Update booking with session ID
    booking.stripeSessionId = session.id;
    await booking.save();

    console.log('Booking updated with session ID:', session.id);

    return NextResponse.json({ 
      sessionId: session.id, 
      bookingId: booking._id,
      url: session.url 
    });
  } catch (error) {
    console.error('✗ Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session', details: String(error) }, { status: 500 });
  }
}
