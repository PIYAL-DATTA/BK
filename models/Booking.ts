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
  duration: number;
  durationUnit: 'minute' | 'hour';
  destination: string;
  latitude?: number;
  longitude?: number;
  hourlyRate?: number;
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
    duration: {
      type: Number,
      default: 1,
    },
    durationUnit: {
      type: String,
      enum: ['minute', 'hour'],
      default: 'hour',
    },
    destination: {
      type: String,
      required: [true, 'Please provide destination'],
    },
    latitude: Number,
    longitude: Number,
    hourlyRate: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
