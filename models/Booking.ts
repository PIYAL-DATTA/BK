import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  stripeSessionId?: string;
  stripePaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema(
  {
    serviceId: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Please provide customer email'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Please provide customer phone'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Please provide booking date'],
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    stripeSessionId: String,
    stripePaymentId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
