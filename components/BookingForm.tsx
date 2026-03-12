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
        {/* Service Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select a Service</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
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
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg">{selectedService.name}</h3>
            <p className="text-gray-600 mb-3">{selectedService.description}</p>
            <div className="border-t pt-3">
              <p className="mb-2">
                <span className="font-medium">Hourly Rate:</span> {selectedService.hourlyRate} Taka/hour
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Customer Details */}
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
            placeholder="Booking Date & Time"
            value={formData.bookingDate}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          {/* Duration Input */}
          {selectedService && (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter duration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit</label>
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="minute">Minute</option>
                  <option value="hour">Hour</option>
                </select>
              </div>
            </div>
          )}

          {/* Destination Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Pickup Location / Destination</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="destination"
                placeholder="Enter destination address"
                value={formData.destination}
                onChange={handleInputChange}
                className="flex-1 p-3 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                📍 Map
              </button>
            </div>
          </div>
        </div>

        {/* Price Display */}
        {selectedService && formData.totalPrice > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Price:</span>
              <span className="text-2xl font-bold text-green-600">{formData.totalPrice} Taka</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {formData.duration} {formData.durationUnit}
              {formData.duration > 1 ? 's' : ''} × {selectedService.hourlyRate} Taka/hour
            </p>
          </div>
        )}

        <button
          onClick={handleBooking}
          disabled={loading || !selectedService}
          className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </div>

      {/* OpenStreetMap Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">Select Location</h2>
                <p className="text-sm text-gray-500 mt-1">Click on the map to select your pickup location</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Map Container */}
            <div
              id="map-container"
              className="flex-1 rounded-lg border border-gray-300 mb-4"
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
                className="flex-1 p-3 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => setShowMapModal(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
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
