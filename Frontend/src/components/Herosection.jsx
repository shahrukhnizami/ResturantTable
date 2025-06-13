import React from 'react'
import { ChefHat, Clock, MapPin, ArrowRight, Star, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Herosection = () => {
  const navigate = useNavigate();
  return (
    <div
        className="relative h-[90vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070")',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold text-white mb-6">
              Smart Table Management System
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Experience seamless dining with our intelligent table management system.
              Book your perfect spot and enjoy a memorable dining experience.
            </p>
            <Button
              onClick={() => navigate("/resturant-table")}
              className="px-8 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              Check Table Availability
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
  )
}

export default Herosection
