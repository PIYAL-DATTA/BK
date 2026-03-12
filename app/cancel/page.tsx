import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-5xl mb-4">✕</div>
        <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
