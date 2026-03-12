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
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    if (!selectedService || !formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.bookingDate) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        amount: selectedService.price * 100, // Convert to cents
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
        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to process booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Book a Service</h1>

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
                {service.name} - ${(service.price / 100).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {selectedService && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold">{selectedService.name}</h3>
            <p className="text-gray-600">{selectedService.description}</p>
            <p className="mt-2">Duration: {selectedService.duration} minutes</p>
            <p className="font-bold text-lg mt-2">Price: ${(selectedService.price / 100).toFixed(2)}</p>
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
