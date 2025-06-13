import React from 'react'
import { ArrowRight,  UtensilsCrossed } from 'lucide-react';
import Button from './Button';

const CTAsection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2070")'
          }}
        />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <UtensilsCrossed className="w-12 h-12 mx-auto mb-6 text-[#1E3A8A]" />
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Experience Smart Dining?
            </h2>
            <p className="text-gray-600 mb-8">
              Try our intelligent table management system and elevate your dining experience.
              Quick bookings, real-time updates, and seamless management all in one place.
            </p>
            <Button
              onClick={() => navigate("/resturant-table")}
              className="px-8 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2 mx-auto"
            >
              Check Available Tables
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
  )
}

export default CTAsection
