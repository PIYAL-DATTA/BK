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
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('Payment completed for session:', session.id);

      const booking = await Booking.findById(session.metadata?.bookingId);
      if (booking) {
        booking.status = 'paid';
        booking.stripePaymentId = session.payment_intent as string;
        await booking.save();

        console.log('Booking marked as paid:', booking._id);

        // Send confirmation emails (with error handling)
        try {
          console.log('Sending booking confirmation email to:', booking.customerEmail);
          const emailSent = await sendBookingConfirmation(
            booking.customerEmail,
            booking.customerName,
            booking.serviceName,
            booking.bookingDate,
            booking.amount
          );
          if (!emailSent) {
            console.warn('Failed to send booking confirmation email');
          }
        } catch (emailError) {
          console.error('Error sending booking confirmation:', emailError);
        }

        try {
          console.log('Sending admin notification email to:', process.env.ADMIN_EMAIL);
          const adminEmailSent = await sendAdminNotification(
            booking.customerName,
            booking.serviceName,
            booking.bookingDate,
            booking.amount
          );
          if (!adminEmailSent) {
            console.warn('Failed to send admin notification email');
          }
        } catch (adminEmailError) {
          console.error('Error sending admin notification:', adminEmailError);
        }

        console.log('✓ Payment webhook processed successfully');
      } else {
        console.warn('Booking not found for session:', session.metadata?.bookingId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
