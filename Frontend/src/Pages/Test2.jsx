import React, { useEffect, useState } from 'react';
import { Users, Coffee, Timer } from 'lucide-react';
import { io } from 'socket.io-client';

function Test2() {
  const [socket, setSocket] = useState([]);
  const [error, setError] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const newSocket = io('http://192.168.3.67:7777');

    newSocket.on('connect', () => {
      console.log('Connected to server 7777');
      setError(null);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to the server. Please try again later.');
    });

    newSocket.on('tableUpdatedData', (data) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        console.log('Received updated table data:', parsedData);

        // Ensure data is in array format
        const updatedTables = Array.isArray(parsedData) ? parsedData : [parsedData];

        setTables(parsedData); // Update state properly
        // console.log(updatedTables);
        
      } catch (error) {
        console.error('Error parsing table data:', error);
      }
    });

    setSocket(newSocket);


    return () => {
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.off('tableUpdatedData');
      newSocket.disconnect();
    };
  }, []); // Removed `tables` dependency to avoid unnecessary re-renders
console.log("tables".tables);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white tracking-tight">
          Restaurant Table Monitor
        </h1>

        {/* Table Grid */}
       {tables?
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="
                      relative overflow-hidden p-6 rounded-xl cursor-pointer
                      transform transition-all duration-300 ease-in-out
                      bg-gradient-to-br from-gray-500 to-grey-600 hover:from-gray-400 hover:to-gray-700
                      hover:scale-105 hover:shadow-2xl
                      backdrop-blur-lg bg-opacity-90
                      border border-white/10"
                    
                  >
                    <div className="absolute top-0 right-0 p-3">
                     
                        <div className="flex items-center gap-1 text-white/90">
                          <Timer size={16} />
                          <span className="text-sm"></span>
                        </div>
                      
                    </div>
                    
                    <div className="text-center text-white">
                      <div className="mb-4">
                        <Coffee 
                          className="
                            w-12 h-12 mx-auto mb-2
                            transform transition-transform duration-300"
                        />
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-2">Table Update...</h2>
                      
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Users size={18} />
                        <p className="text-sm">Updates Seats</p>
                      </div>
                      
                      <p className="
                        font-medium text-lg
                        transition-opacity duration-300
                       opacity-50}
                      ">
                      Waiting For Updates
                      </p>
                    </div>
                  </div>
                
              </div> 
              :<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {tables.map((table) => (
              <div
                key={table.id}
                className={`relative overflow-hidden p-6 rounded-xl transform transition-all duration-300 ease-in-out ${
                  table.isOccupied
                    ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    : 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                } hover:scale-105 hover:shadow-2xl backdrop-blur-lg bg-opacity-90 border border-white/10`}
              >
                {/* Display time if occupied */}
                {table.isOccupied && (
                  <div className="absolute top-0 right-0 p-3 flex items-center gap-1 text-white/90">
                    <Timer size={16} />
                    <span className="text-sm">{table.time}</span>
                  </div>
                )}
  
                {/* Table Details */}
                <div className="text-center text-white">
                  <Coffee className="w-12 h-12 mx-auto mb-2" />
                  <h2 className="text-2xl font-bold mb-2">Table {table.id}</h2>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Users size={18} />
                    <p className="text-sm">{table.seats} Seats</p>
                  </div>
                  <p className={table.isOccupied ? 'opacity-100' : 'opacity-90'}>
                    {table.isOccupied ? `Occupied by ${table.reservedBy}` : 'Available'}
                  </p>
                </div>
              </div>
            ))}
          </div>}
        

        
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex gap-6 bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-white/90">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white/90">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test2;
