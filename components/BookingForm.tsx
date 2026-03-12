'use client';

import { useState, useEffect } from 'react';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function BookingForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  });
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
  });

  // Default services with pricing
  const defaultServices: Service[] = [
    {
      _id: '1',
      name: 'CNG',
      description: 'Auto Rickshaw Service',
      price: 1000, // 10 Taka in cents (converted for Stripe)
      duration: 30,
    },
    {
      _id: '2',
      name: 'Car',
      description: 'Car Rental Service',
      price: 2000, // 20 Taka in cents
      duration: 60,
    },
    {
      _id: '3',
      name: 'Bus',
      description: 'Bus Travel Service',
      price: 3000, // 30 Taka in cents
      duration: 120,
    },
  ];

  useEffect(() => {
    // Use default services instead of fetching
    setServices(defaultServices);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    if (!selectedService || !formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.bookingDate) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const bookingData = {
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        amount: selectedService.price * 100, // Convert to cents for Stripe
        ...formData,
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingData }),
      });

      const data = await response.json();

      if (data.sessionId) {
        setMessage({ type: 'success', text: 'Booking successful! Redirecting to payment...' });
        // Redirect to Stripe Checkout
        setTimeout(() => {
          window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Booking failed. Please try again.' });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage({ type: 'error', text: 'Booking failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-green-600">Book a Service</h1>

      {message.type && (
        <div
          className={`mb-6 p-4 rounded-lg text-white ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select a Service</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={(e) => {
              const service = services.find((s) => s._id === e.target.value);
              setSelectedService(service || null);
            }}
          >
            <option value="">Choose a service...</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - {service.price / 100} Taka
              </option>
            ))}
          </select>
        </div>

        {selectedService && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg">{selectedService.name}</h3>
            <p className="text-gray-600 mb-3">{selectedService.description}</p>
            <div className="border-t pt-3">
              <p className="mb-2">
                <span className="font-medium">Duration:</span> {selectedService.duration} minutes
              </p>
              <p className="font-bold text-lg text-green-600">
                <span className="font-medium">Price:</span> {selectedService.price / 100} Taka
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            name="customerName"
            placeholder="Full Name"
            value={formData.customerName}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            name="customerEmail"
            placeholder="Email Address"
            value={formData.customerEmail}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="tel"
            name="customerPhone"
            placeholder="Phone Number"
            value={formData.customerPhone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="datetime-local"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          onClick={handleBooking}
          disabled={loading || !selectedService}
          className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </div>
    </div>
  );
}
