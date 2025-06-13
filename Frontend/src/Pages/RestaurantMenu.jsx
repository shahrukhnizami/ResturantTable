import React, { useState } from 'react';
import { Utensils, Coffee, Pizza, IceCream, ChefHat } from 'lucide-react';



const menuItems= [
  {
    id: 1,
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with wild mushrooms and fresh truffle shavings",
    price: 28,
    category: "mains",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    name: "Pan-Seared Salmon",
    description: "Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables",
    price: 32,
    category: "mains",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: 3,
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
    price: 12,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800&h=600"
  },
  {
    id: 4,
    name: "Artisanal Coffee",
    description: "Single-origin coffee beans, freshly ground and brewed to perfection",
    price: 5,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800&h=600"
  }
];

const categories = [
  { name: "all", icon: ChefHat },
  { name: "mains", icon: Utensils },
  { name: "desserts", icon: IceCream },
  { name: "beverages", icon: Coffee },
  { name: "specials", icon: Pizza }
];

const RestaurantMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = menuItems.filter(item => 
    selectedCategory === "all" ? true : item.category === selectedCategory
  );

  return (
    <div className="max-w-7xl  bg-black mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Category Navigation */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-2 mt-5 space-x-2 bg-white rounded-xl shadow-md">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === category.name
                    ? "bg-amber-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                <span className="capitalize">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-amber-600 text-white px-4 py-2 rounded-bl-xl">
                ${item.price}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <button className="w-full cursor-pointer bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-black
               transition duration-200">
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No items available in this category at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;