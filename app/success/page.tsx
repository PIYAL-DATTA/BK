import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your booking has been confirmed. A confirmation email has been sent to your email address.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Book Another Service
        </Link>
      </div>
    </div>
  );
}
