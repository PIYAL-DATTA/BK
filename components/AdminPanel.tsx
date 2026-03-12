'use client';

import { useState, useEffect } from 'react';

interface Booking {
  _id: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  amount: number;
  status: string;
  duration: number;
  durationUnit: string;
  destination: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceName: 'Car',
    bookingDate: '',
    duration: 1,
    durationUnit: 'hour',
    destination: '',
    amount: 0,
    status: 'pending',
  });

  const handleLogin = () => {
    if (adminKey) {
      setIsAuthenticated(true);
      fetchBookings();
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings', {
        headers: {
          authorization: `Bearer ${adminKey}`,
        },
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async () => {
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify(formData),
      });
      const newBooking = await response.json();
      setBookings([...bookings, newBooking]);
      resetForm();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking');
    }
  };

  const updateBooking = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify(formData),
      });
      const updatedBooking = await response.json();
      setBookings(bookings.map((b) => (b._id === id ? updatedBooking : b)));
      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${adminKey}`,
        },
      });
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert('Failed to delete booking');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      serviceName: 'Car',
      bookingDate: '',
      duration: 1,
      durationUnit: 'hour',
      destination: '',
      amount: 0,
      status: 'pending',
    });
  };

  const handleEditClick = (booking: Booking) => {
    setFormData({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      serviceName: booking.serviceName,
      bookingDate: booking.bookingDate.slice(0, 16),
      duration: booking.duration,
      durationUnit: booking.durationUnit,
      destination: booking.destination,
      amount: booking.amount,
      status: booking.status,
    });
    setEditingId(booking._id);
    setShowCreateForm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full p-4 border-2 border-gray-300 rounded-lg mb-6 text-gray-900 font-medium focus:border-blue-600 focus:outline-none text-base"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📊 Bookings Management</h1>
            <p className="text-gray-700 mt-2 text-lg font-medium">Manage all customer bookings and CRUD operations</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition text-base"
          >
            Logout
          </button>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingId) && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? '✏️ Edit Booking' : '➕ Create New Booking'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Phone</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                  placeholder="0123456789"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Service</label>
                <select
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                >
                  <option>CNG</option>
                  <option>Car</option>
                  <option>Bus</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Booking Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Destination</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                  placeholder="Address"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Duration</label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Unit</label>
                <select
                  value={formData.durationUnit}
                  onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                >
                  <option value="minute">Minute</option>
                  <option value="hour">Hour</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Amount (Taka)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-bold mb-2 text-base">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => (editingId ? updateBooking(editingId) : createBooking())}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition text-base"
              >
                {editingId ? '💾 Update' : '➕ Create'}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateForm(false);
                  setEditingId(null);
                }}
                className="flex-1 bg-gray-600 text-white p-3 rounded-lg font-bold hover:bg-gray-700 transition text-base"
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Create Button */}
        {!showCreateForm && !editingId && (
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="mb-8 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition text-base"
          >
            ➕ Create New Booking
          </button>
        )}

        {/* Bookings Table */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-900 text-xl font-bold">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-900 text-xl font-bold">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left font-bold">Customer</th>
                    <th className="p-4 text-left font-bold">Service</th>
                    <th className="p-4 text-left font-bold">Date</th>
                    <th className="p-4 text-left font-bold">Amount</th>
                    <th className="p-4 text-left font-bold">Duration</th>
                    <th className="p-4 text-left font-bold">Status</th>
                    <th className="p-4 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-900 font-medium">
                        <div>{booking.customerName}</div>
                        <div className="text-sm text-gray-600">{booking.customerEmail}</div>
                      </td>
                      <td className="p-4 text-gray-900 font-bold">{booking.serviceName}</td>
                      <td className="p-4 text-gray-900 font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-900 font-bold text-green-600">
                        ৳{booking.amount}
                      </td>
                      <td className="p-4 text-gray-900 font-medium">
                        {booking.duration} {booking.durationUnit}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-white text-sm ${
                            booking.status === 'paid'
                              ? 'bg-green-600'
                              : booking.status === 'confirmed'
                              ? 'bg-blue-600'
                              : booking.status === 'cancelled'
                              ? 'bg-red-600'
                              : 'bg-yellow-600'
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(booking)}
                            className="bg-blue-600 text-white px-3 py-2 rounded font-bold hover:bg-blue-700 transition text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteBooking(booking._id)}
                            className="bg-red-600 text-white px-3 py-2 rounded font-bold hover:bg-red-700 transition text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-100 p-4 text-gray-900 font-bold text-lg">
              Total Bookings: {bookings.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
