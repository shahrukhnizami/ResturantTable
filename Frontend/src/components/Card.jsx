import React from 'react'
import { ChefHat, Clock, MapPin, ArrowRight, Star, UtensilsCrossed } from 'lucide-react';

const Card = () => {
  return (
    <div className="container mx-auto px-6 -mt-20 relative z-20">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          icon: <Clock className="w-6 h-6" />,
          title: "Quick Booking",
          content: "Reserve your table in seconds"
        },
        {
          icon: <MapPin className="w-6 h-6" />,
          title: "Table Layout",
          content: "Interactive floor plan view"
        },
        {
          icon: <ChefHat className="w-6 h-6" />,
          title: "Real-time Updates",
          content: "Live table availability status"
        }
      ].map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1E3A8A] text-white rounded-full">
              {item.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default Card
