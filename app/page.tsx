'use client';

import dynamic from 'next/dynamic';

const BookingForm = dynamic(() => import('@/components/BookingForm'), {
  ssr: false,
  loading: () => <div className="text-center py-20">Loading booking form...</div>,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <BookingForm />
    </div>
  );
}
