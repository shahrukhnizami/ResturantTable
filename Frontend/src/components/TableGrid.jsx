import React from 'react';
import { Users, Coffee, Clock } from 'lucide-react';



export function TableGrid({ tables, onTableClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'occupied':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => onTableClick(table)}
          className={`${getStatusColor(
            table.status
          )} p-6 rounded-xl border-2 hover:opacity-90 transition-all transform hover:scale-105 flex flex-col items-center`}
        >
          <div className="text-2xl font-bold mb-3">Table {table.number}</div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} />
            <span>{table.capacity} Seats</span>
          </div>
          {table.status === 'occupied' && table.currentOrder && (
            <div className="flex items-center gap-2 mt-2">
              <Coffee size={18} />
              <span>{table.currentOrder.items.length} items</span>
            </div>
          )}
          {table.status === 'reserved' && (
            <div className="flex items-center gap-2 mt-2">
              <Clock size={18} />
              <span>Reserved</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}