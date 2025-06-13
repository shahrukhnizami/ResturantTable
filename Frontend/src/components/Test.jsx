import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Test() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = io('http://192.168.3.67:7777');

    // Set up event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server 7777');
      setError(null);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to the server. Please try again later.');
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
      setError('An error occurred. Please check your connection.');
    });

    // Listen for the 'tableUpdatedData' event
    newSocket.on('tableUpdatedData', (data) => {
      
      console.log('Received data:', JSON.parse(data));
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    });
    newSocket.on('message', (data) => {
      
      // console.log('Received data:', JSON.parse(data));
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      console.log('Sending message:', message);
      socket.emit('message', message); // Emit the 'message' event
      setMessage('');
    } else {
      setError('Socket is not connected or message is empty.');
    }
  };

  return (
    <>
      <div className="space-y-3 h-dvh flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Socket.IO Chat</h1>
        {/* Display error message if there's an error */}
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <input
            type="text"
            className="border rounded-xl px-2 py-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            className="border m-2 rounded-xl px-2 py-1 bg-blue-500 text-white hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Received Messages:</h2>
          <ul className="space-y-2">
            {receivedMessages.map((msg, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded-lg">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Test;