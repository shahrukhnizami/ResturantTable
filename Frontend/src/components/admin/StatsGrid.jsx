import React from 'react'
import {
    Users,
    UtensilsCrossed,
    Clock,
    DollarSign,
    Calendar,
    TrendingUp,
    Settings,
    LogOut,
    Bell,
    Search,
    ChefHat,
    Coffee,
    BarChart3
  } from 'lucide-react';

const StatsGrid = () => {
  return (
    <>
     {/* Stats Grid */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                label: "Total Customers",
                value: "1,234",
                trend: "+12.5%",
                color: "bg-blue-500"
              },
              {
                icon: <UtensilsCrossed className="w-6 h-6" />,
                label: "Active Tables",
                value: "28",
                trend: "+3.2%",
                color: "bg-green-500"
              },
              {
                icon: <Clock className="w-6 h-6" />,
                label: "Avg. Waiting Time",
                value: "12min",
                trend: "-2.4%",
                color: "bg-amber-500"
              },
              {
                icon: <DollarSign className="w-6 h-6" />,
                label: "Today's Revenue",
                value: "$3,428",
                trend: "+8.1%",
                color: "bg-purple-500"
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
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
    </>
  )
}

export default StatsGrid
