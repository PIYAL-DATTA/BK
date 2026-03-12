import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/models/Booking';
import Stripe from 'stripe';
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const booking = await Booking.findById(session.metadata?.bookingId);
      if (booking) {
        booking.status = 'paid';
        booking.stripePaymentId = session.payment_intent as string;
        await booking.save();

        // Send confirmation emails
        await sendBookingConfirmation(
          booking.customerEmail,
          booking.customerName,
          booking.serviceName,
          booking.bookingDate,
          booking.amount
        );

        await sendAdminNotification(
          booking.customerName,
          booking.serviceName,
          booking.bookingDate,
          booking.amount
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
