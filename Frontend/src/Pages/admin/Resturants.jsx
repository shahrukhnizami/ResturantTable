import React, { useState } from 'react';
import { Building2, MapPin, Clock, Star, Search, Plus, MoreVertical, Phone, Globe, Mail, ChefHat, Table } from 'lucide-react';

function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // State for selected restaurant
  const [activeTableTab, setActiveTableTab] = useState('all'); // State for active table tab

  // Sample restaurant data
  const restaurants = [
    {
      id: '1',
      name: 'Kababjees',
      location: '123 Main St, Karachi',
      rating: 4.8,
      cuisine: 'Karachi',
      status: 'active',
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'contact@goldenspoon.com',
        website: 'www.goldenspoon.com'
      },
      hours: {
        open: '11:00',
        close: '23:00'
      },
      capacity: 120,
      tables: [
        { id: 1, number: 1, capacity: 2, status: 'available' },
        { id: 2, number: 2, capacity: 4, status: 'occupied' },
        { id: 3, number: 3, capacity: 6, status: 'reserved' },
      ]
    },
    {
      id: '2',
      name: 'E-Street',
      location: '456 Park Ave, Karachi',
      rating: 4.6,
      cuisine: 'Karachi',
      status: 'active',
      contact: {
        phone: '+1 (555) 234-5678',
        email: 'info@sakura.com',
        website: 'www.sakura.com'
      },
      hours: {
        open: '12:00',
        close: '22:00'
      },
      capacity: 80,
      tables: [
        { id: 4, number: 4, capacity: 4, status: 'available' },
        { id: 5, number: 5, capacity: 2, status: 'occupied' },
      ]
    },
    {
      id: '3',
      name: 'La Piazza',
      location: '789 Broadway, Karachi',
      rating: 4.5,
      cuisine: 'Karachi',
      status: 'maintenance',
      contact: {
        phone: '+1 (555) 345-6789',
        email: 'hello@lapiazza.com',
        website: 'www.lapiazza.com'
      },
      hours: {
        open: '11:30',
        close: '22:30'
      },
      capacity: 100,
      tables: [
        { id: 6, number: 6, capacity: 6, status: 'reserved' },
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || restaurant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Tabs configuration for tables
  const tableTabs = [
    { id: 'all', label: 'All Tables' },
    { id: 'available', label: 'Available' },
    { id: 'occupied', label: 'Occupied' },
    { id: 'reserved', label: 'Reserved' },
  ];

  // Filter tables based on active tab
  const filteredTables = selectedRestaurant
    ? selectedRestaurant.tables.filter(table => activeTableTab === 'all' || table.status === activeTableTab)
    : [];

  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurants</h1>
        <p className="text-gray-600">Manage your restaurant portfolio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: <Building2 className="w-6 h-6" />,
            label: "Total Restaurants",
            value: restaurants.length.toString(),
            trend: "+1",
            color: "bg-blue-500"
          },
          {
            icon: <ChefHat className="w-6 h-6" />,
            label: "Active Locations",
            value: restaurants.filter(r => r.status === 'active').length.toString(),
            trend: "0",
            color: "bg-green-500"
          },
          {
            icon: <Star className="w-6 h-6" />,
            label: "Avg. Rating",
            value: "4.6",
            trend: "+0.2",
            color: "bg-amber-500"
          },
          {
            icon: <Clock className="w-6 h-6" />,
            label: "Under Maintenance",
            value: restaurants.filter(r => r.status === 'maintenance').length.toString(),
            trend: "+1",
            color: "bg-yellow-500"
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
                stat.trend.startsWith('+') ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stat.trend} this month
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
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full md:w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <button className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
              <Plus className="w-5 h-5" />
              Add Restaurant
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRestaurant(restaurant)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                </div>
                <button className="text-gray-400 cursor-pointer hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{restaurant.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{restaurant.hours.open} - {restaurant.hours.close}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">{restaurant.rating} Rating</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <a href={`tel:${restaurant.contact.phone}`} className="text-gray-400 hover:text-gray-600">
                  <Phone className="w-5 h-5" />
                </a>
                <a href={`mailto:${restaurant.contact.email}`} className="text-gray-400 hover:text-gray-600">
                  <Mail className="w-5 h-5" />
                </a>
                <a href={`https://${restaurant.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                  <Globe className="w-5 h-5" />
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(restaurant.status)}`}>
                  {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  Capacity: {restaurant.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {filteredRestaurants.length} of {restaurants.length} restaurants
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

      {/* Restaurant Details and Tables Section */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Restaurant Info Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRestaurant.name}</h2>
                  <p className="text-gray-600">{selectedRestaurant.location}</p>
                </div>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Restaurant Info Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <span>{selectedRestaurant.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-5 h-5" />
                      <span>{selectedRestaurant.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-5 h-5" />
                      <a href={`https://${selectedRestaurant.contact.website}`} target="_blank" rel="noopener noreferrer">
                        {selectedRestaurant.contact.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours and Capacity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours & Capacity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{selectedRestaurant.hours.open} - {selectedRestaurant.hours.close}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>Capacity: {selectedRestaurant.capacity} guests</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tables Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tables</h3>
                {/* Table Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                  {tableTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTableTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTableTab === tab.id
                          ? 'border-b-2 border-amber-500 text-amber-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTables.map((table) => (
                    <div key={table.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Table {table.number}</h4>
                          <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(table.status)}`}>
                          {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Restaurants;