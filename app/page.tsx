'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const BookingForm = dynamic(() => import('@/components/BookingForm'), {
  ssr: false,
  loading: () => <div className="text-center py-20">Loading booking form...</div>,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Easy & Fast Transportation Booking
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Book reliable CNG, Cars, and Buses instantly. Get professional service at competitive prices with real-time location tracking.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105">
                  Book Now
                </button>
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm">
                <svg className="w-full h-full text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect transportation for your needs with transparent pricing and professional drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CNG Card */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="inline-block bg-yellow-100 p-4 rounded-full">
                  <svg className="w-12 h-12 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">CNG Auto</h3>
              <p className="text-gray-600 mb-6">Quick and affordable auto rickshaw service for short distances and local travel.</p>
              <div className="text-3xl font-bold text-green-600 mb-4">
                ৳100 <span className="text-lg text-gray-600">/hour</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ Affordable rates</li>
                <li>✓ Quick pickup</li>
                <li>✓ Local routes</li>
              </ul>
            </div>

            {/* Car Card */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-8 text-center transform md:-translate-y-4">
              <div className="flex justify-center mb-4">
                <div className="inline-block bg-blue-100 p-4 rounded-full">
                  <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Car Rental</h3>
              <p className="text-gray-600 mb-6">Comfortable car service for longer distances with professional drivers and premium comfort.</p>
              <div className="text-3xl font-bold text-green-600 mb-4">
                ৳300 <span className="text-lg text-gray-600">/hour</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ Comfortable</li>
                <li>✓ Professional drivers</li>
                <li>✓ AC available</li>
              </ul>
            </div>

            {/* Bus Card */}
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="inline-block bg-purple-100 p-4 rounded-full">
                  <svg className="w-12 h-12 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 19h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V9h-2v2zm-6-9C6.48 2 2 2 2 6c0 3.25 3 5.68 5 7.97V19h2v-5.97C10 10.68 13 8.25 13 5c0-4-4.48-4-6-4zm0 2h4c0 2.5-2 4-4 4-2 0-4-1.5-4-4h4z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bus Travel</h3>
              <p className="text-gray-600 mb-6">Long-distance bus service for group travel and inter-city journeys with comfort.</p>
              <div className="text-3xl font-bold text-green-600 mb-4">
                ৳500 <span className="text-lg text-gray-600">/hour</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ Group travel</li>
                <li>✓ Long distance</li>
                <li>✓ Budget friendly</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Booking your ride is simple and straightforward in just 4 easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Select Service', desc: 'Choose from CNG, Car, or Bus based on your needs' },
              { num: 2, title: 'Set Duration', desc: 'Specify how long you need the service for' },
              { num: 3, title: 'Pick Location', desc: 'Select your pickup point using our interactive map' },
              { num: 4, title: 'Confirm & Pay', desc: 'Complete payment and confirm your booking' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Us?
              </h2>
              {[
                { icon: '🛡️', title: 'Safe & Secure', desc: 'Professional drivers with verified credentials' },
                { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges - pay exactly what you see' },
                { icon: '⏱️', title: 'On-Time Service', desc: 'Quick pickup and reliable arrival times' },
                { icon: '📍', title: 'Real-time Tracking', desc: 'Track your ride in real-time with GPS' },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">10K+</div>
                  <p className="text-blue-100">Happy Customers</p>
                </div>
                <div className="border-t border-blue-400 my-6"></div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">500+</div>
                  <p className="text-blue-100">Professional Drivers</p>
                </div>
                <div className="border-t border-blue-400 my-6"></div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">4.8★</div>
                  <p className="text-blue-100">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Book Your Ride?
            </h2>
            <p className="text-xl text-gray-600">
              Fill in your details below and secure your booking in minutes.
            </p>
          </div>

          <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-xl overflow-hidden">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Special Offers & Discounts</h2>
          <p className="text-xl text-blue-100 mb-8">
            First-time users get 20% off on their first booking. Use code: WELCOME20
          </p>
          <div className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg">
            WELCOME20
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Service Booking</h3>
            <p className="text-sm">Your trusted transportation booking platform.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">CNG Auto</a></li>
              <li><a href="#" className="hover:text-white transition">Car Rental</a></li>
              <li><a href="#" className="hover:text-white transition">Bus Travel</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <div className="space-y-2 text-sm">
              <p><a href="#" className="hover:text-white transition">Facebook</a></p>
              <p><a href="#" className="hover:text-white transition">Twitter</a></p>
              <p><a href="#" className="hover:text-white transition">Instagram</a></p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2026 Service Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
