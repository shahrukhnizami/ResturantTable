import React from 'react'

const Experience = () => {
  return (
    <section className="bg-gray-50 py-20 mt-20 ">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Smart Dining Management
              </h2>
              <p className="text-gray-600 mb-8">
                Our intelligent table management system ensures a smooth dining experience.
                From real-time availability updates to seamless reservations, we've got
                everything covered for both staff and guests.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "100%", label: "Digital Management" },
                  { number: "24/7", label: "System Availability" },
                  { number: "2min", label: "Booking Time" },
                  { number: "5000+", label: "Tables Managed" }
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-[#1E3A8A] mb-1">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=2071"
                alt="Restaurant ambiance"
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&q=80&w=2070"
                alt="Dining experience"
                className="w-full h-64 object-cover rounded-xl mt-8 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
  )
}

export default Experience
