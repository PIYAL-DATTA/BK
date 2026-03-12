import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Service Booking',
  description: 'Book your favorite services online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js"
        ></script>
      </head>
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                🚗
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Booking</h1>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Home
              </a>
              <a href="/#services" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Services
              </a>
              <a href="/#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition">
                How It Works
              </a>
              <a href="/admin" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition">
                Admin
              </a>
            </div>
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}
