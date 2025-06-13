import { X, Users, Clock, CreditCard } from 'lucide-react';



export function TableDetails({ table, onClose, onStatusChange }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'occupied':
        return 'text-red-600';
      case 'reserved':
        return 'text-yellow-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Table {table.number}</h2>
            <p className={`${getStatusColor(table.status)} font-medium`}>
              {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-full">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="text-lg font-semibold">{table.capacity} People</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={table.status}
              onChange={(e) => onStatusChange(table.id, e.target.value )}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          {table.currentOrder && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Current Order</h3>
                  <p className="text-sm text-gray-600">Order #{table.currentOrder.id}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                {table.currentOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-900">Total</p>
                  <p className="text-xl font-bold text-amber-600">
                    {formatCurrency(calculateTotal(table.currentOrder.items))}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>Started at {table.currentOrder.startTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}