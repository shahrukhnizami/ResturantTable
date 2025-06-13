import React, { useState } from 'react';

import { Calendar, Clock, Users, Search, Filter, MoreVertical, Check, X, Phone, Mail } from 'lucide-react';



function Reservations() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample reservation data
  const reservations= [
    {
      id: '1',
      customerName: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      date: '2025-03-20',
      time: '19:00',
      guests: 4,
      tableNumber: 12,
      status: 'confirmed',
      specialRequests: 'Window seat preferred'
    },
    {
      id: '2',
      customerName: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1 (555) 234-5678',
      date: '2025-03-20',
      time: '20:00',
      guests: 2,
      tableNumber: 5,
      status: 'pending'
    },
    {
      id: '3',
      customerName: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 (555) 345-6789',
      date: '2025-03-20',
      time: '18:30',
      guests: 6,
      tableNumber: 8,
      status: 'cancelled',
      specialRequests: 'Birthday celebration'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filterStatus === 'all') return true;
    return reservation.status === filterStatus;
  });

  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reservations</h1>
        <p className="text-gray-600">Manage and track all restaurant reservations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: <Calendar className="w-6 h-6" />,
            label: "Today's Bookings",
            value: "24",
            trend: "+3",
            color: "bg-blue-500"
          },
          {
            icon: <Clock className="w-6 h-6" />,
            label: "Pending Approval",
            value: "8",
            trend: "-2",
            color: "bg-yellow-500"
          },
          {
            icon: <Users className="w-6 h-6" />,
            label: "Total Guests",
            value: "86",
            trend: "+12",
            color: "bg-green-500"
          },
          {
            icon: <X className="w-6 h-6" />,
            label: "Cancellations",
            value: "3",
            trend: "-1",
            color: "bg-red-500"
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <div className="text-white">{stat.icon}</div>
            </div>
            <p className="text-gray-600 mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <span className={`text-sm font-medium ${
                stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend} today
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reservations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full md:w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <button className="px-4 py-2 bg-amber-500 cursor-pointer text-white rounded-lg hover:bg-amber-600 transition-colors">
                New Reservation
              </button>
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date & Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Table</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{reservation.customerName}</div>
                      <div className="text-sm text-gray-500">{reservation.guests} guests</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(reservation.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">Table {reservation.tableNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${reservation.email}`} className="text-gray-400 hover:text-gray-600">
                        <Mail className="w-5 h-5" />
                      </a>
                      <a href={`tel:${reservation.phone}`} className="text-gray-400 hover:text-gray-600">
                        <Phone className="w-5 h-5" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {reservation.status === 'pending' && (
                        <>
                          <button className="p-1 cursor-pointer text-green-600 hover:text-green-800">
                            <Check className="w-5 h-5" />
                          </button>
                          <button className="p-1 cursor-pointer text-red-600 hover:text-red-800">
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button className="p-1 cursor-pointer text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            Showing 1 to {filteredReservations.length} of {filteredReservations.length} reservations
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 cursor-pointer py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 cursor-pointer py-1 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
 </>
  );
}

export default Reservations;