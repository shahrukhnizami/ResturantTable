import React from 'react';
import { ClipboardCheck, Users, Clock, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold text-white mb-6">
              Smart Table Management System
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Real-time table monitoring and reservation management system. 
              Track occupancy, manage reservations, and optimize your dining space efficiently.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/tables" 
                className="px-8 py-3 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <ClipboardCheck className="w-5 h-5" />
                Monitor Tables
              </Link>
              <button className="px-8 py-3 cursor-pointer bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 backdrop-blur-sm transition-colors flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" />
                Make Reservation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Real-time Monitoring</h3>
            <p className="text-white/80">
              Track table occupancy in real-time. Get instant updates on table status 
              and seating capacity.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Time Tracking</h3>
            <p className="text-white/80">
              Monitor occupancy duration for each table. Optimize turnover and 
              manage waiting times effectively.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center mb-6">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Smart Reservations</h3>
            <p className="text-white/80">
              Manage reservations efficiently. Prevent double bookings and optimize 
              table assignments automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 pb-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-500 mb-2">12</div>
              <div className="text-white/80">Active Tables</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-500 mb-2">98%</div>
              <div className="text-white/80">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-500 mb-2">5min</div>
              <div className="text-white/80">Avg. Update Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-500 mb-2">24/7</div>
              <div className="text-white/80">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;