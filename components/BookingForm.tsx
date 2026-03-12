'use client';

import { useState, useEffect, useRef } from 'react';
import L from '@/lib/leaflet-config';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  hourlyRate: number; // Hourly rate in Taka
}

export default function BookingForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  });
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    duration: 1,
    durationUnit: 'hour',
    destination: '',
    totalPrice: 0,
  });

  // Service data with hourly rates (in Taka)
  const defaultServices: Service[] = [
    {
      _id: '1',
      name: 'CNG',
      description: 'Auto Rickshaw Service',
      price: 1000,
      duration: 30,
      hourlyRate: 100, // 100 Taka per hour
    },
    {
      _id: '2',
      name: 'Car',
      description: 'Car Rental Service',
      price: 2000,
      duration: 60,
      hourlyRate: 300, // 300 Taka per hour
    },
    {
      _id: '3',
      name: 'Bus',
      description: 'Bus Travel Service',
      price: 3000,
      duration: 120,
      hourlyRate: 500, // 500 Taka per hour
    },
  ];

  useEffect(() => {
    setServices(defaultServices);
  }, []);

  // Initialize map when modal opens
  useEffect(() => {
    if (showMapModal && !mapRef.current) {
      // Default center: Dhaka, Bangladesh
      const defaultLat = 23.8103;
      const defaultLng = 90.4125;

      setTimeout(() => {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer && !mapRef.current) {
          const map = L.map('map-container').setView([defaultLat, defaultLng], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);

          // Add click handler to place marker
          map.on('click', (e) => {
            const { lat, lng } = e.latlng;

            // Remove old marker
            if (markerRef.current) {
              map.removeLayer(markerRef.current);
            }

            // Add new marker
            const marker = L.marker([lat, lng])
              .addTo(map)
              .bindPopup(`Selected Location<br/>Lat: ${lat.toFixed(4)}<br/>Lng: ${lng.toFixed(4)}`);

            markerRef.current = marker;

            // Reverse geocode to get address (using Nominatim API - free)
            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
              .then((res) => res.json())
              .then((data) => {
                const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                setFormData((prev) => ({
                  ...prev,
                  destination: address,
                }));
              })
              .catch(() => {
                // Fallback to coordinates if reverse geocoding fails
                setFormData((prev) => ({
                  ...prev,
                  destination: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                }));
              });
          });

          mapRef.current = map;
        }
      }, 100);
    }

    return () => {
      // Cleanup map when modal closes
      if (!showMapModal && mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [showMapModal]);

  // Calculate total price based on duration
  useEffect(() => {
    if (selectedService) {
      let durationInMinutes = formData.duration;
      if (formData.durationUnit === 'hour') {
        durationInMinutes = formData.duration * 60;
      }
      
      const durationInHours = durationInMinutes / 60;
      const totalPrice = Math.ceil(selectedService.hourlyRate * durationInHours);
      
      setFormData(prev => ({
        ...prev,
        totalPrice,
      }));
    }
  }, [selectedService, formData.duration, formData.durationUnit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = services.find((s) => s._id === e.target.value);
    setSelectedService(service || null);
  };

  const handleBooking = async () => {
    if (!selectedService || !formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.bookingDate || !formData.destination) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const bookingData = {
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        amount: formData.totalPrice * 100, // Convert to cents for Stripe
        hourlyRate: selectedService.hourlyRate,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        bookingDate: formData.bookingDate,
        duration: formData.duration,
        durationUnit: formData.durationUnit,
        destination: formData.destination,
      };

      console.log('Sending booking request with data:', bookingData);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingData }),
      });

      const data = await response.json();

      console.log('Checkout response:', data);

      if (data.url) {
        setMessage({ type: 'success', text: 'Booking successful! Redirecting to payment...' });
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
      } else if (data.sessionId) {
        setMessage({ type: 'success', text: 'Booking successful! Redirecting to payment...' });
        setTimeout(() => {
          window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
        }, 1500);
      } else {
        console.error('No session URL or ID returned:', data);
        setMessage({ type: 'error', text: `Booking failed: ${data.error || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage({ type: 'error', text: 'Booking failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-green-600">Book a Service</h1>

      {message.type && (
        <div
          className={`mb-6 p-4 rounded-lg text-white text-lg font-semibold ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Service Selection */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-900 mb-3">Select a Service</label>
          <select
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
            onChange={handleServiceChange}
          >
            <option value="">Choose a service...</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - {service.hourlyRate} Taka/hour
              </option>
            ))}
          </select>
        </div>

        {/* Service Details */}
        {selectedService && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <h3 className="font-bold text-2xl text-gray-900 mb-2">{selectedService.name}</h3>
            <p className="text-gray-700 mb-4 text-base">{selectedService.description}</p>
            <div className="border-t pt-3">
              <p className="mb-2 text-base text-gray-800">
                <span className="font-bold">Hourly Rate:</span> <span className="text-lg font-bold text-green-600">{selectedService.hourlyRate} Taka/hour</span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Customer Details */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Full Name</label>
            <input
              type="text"
              name="customerName"
              placeholder="Enter your full name"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              name="customerEmail"
              placeholder="Enter your email address"
              value={formData.customerEmail}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Phone Number</label>
            <input
              type="tel"
              name="customerPhone"
              placeholder="Enter your phone number"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Booking Date & Time</label>
            <input
              type="datetime-local"
              name="bookingDate"
              placeholder="Select date and time"
              value={formData.bookingDate}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Duration Input */}
          {selectedService && (
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">Duration</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
                    placeholder="Enter duration"
                  />
                </div>
                <div>
                  <select
                    name="durationUnit"
                    value={formData.durationUnit}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
                  >
                    <option value="minute">Minute</option>
                    <option value="hour">Hour</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Destination Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Pickup Location / Destination</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="destination"
                placeholder="Enter destination address"
                value={formData.destination}
                onChange={handleInputChange}
                className="flex-1 p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-base"
              >
                📍 Map
              </button>
            </div>
          </div>
        </div>

        {/* Price Display */}
        {selectedService && formData.totalPrice > 0 && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold text-gray-900">Total Price:</span>
              <span className="text-4xl font-bold text-green-600">{formData.totalPrice} Taka</span>
            </div>
            <p className="text-base text-gray-700 font-medium">
              {formData.duration} {formData.durationUnit}
              {formData.duration > 1 ? 's' : ''} × {selectedService.hourlyRate} Taka/hour
            </p>
          </div>
        )}

        <button
          onClick={handleBooking}
          disabled={loading || !selectedService}
          className="w-full mt-8 bg-blue-600 text-white p-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </div>

      {/* OpenStreetMap Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Select Location</h2>
                <p className="text-base text-gray-600 mt-2 font-medium">Click on the map to select your pickup location</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Map Container */}
            <div
              id="map-container"
              className="flex-1 rounded-lg border-2 border-gray-300 mb-6"
              style={{ height: '300px' }}
            />

            {/* Address Display and Confirm */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Selected address will appear here"
                value={formData.destination}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                className="flex-1 p-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:border-blue-600 focus:outline-none"
              />
              <button
                onClick={() => setShowMapModal(false)}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-base whitespace-nowrap"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
