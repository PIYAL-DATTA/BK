'use client';

import { useState, useEffect } from 'react';

interface Booking {
  _id: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const updateBooking = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ status }),
      });
      const updatedBooking = await response.json();
      setBookings(bookings.map((b) => (b._id === id ? updatedBooking : b)));
    } catch (error) {
      console.error('Failed to update booking:', error);
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
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{booking.customerName}</td>
                  <td className="p-4">{booking.serviceName}</td>
                  <td className="p-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td className="p-4">${(booking.amount / 100).toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateBooking(booking._id, e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteBooking(booking._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
