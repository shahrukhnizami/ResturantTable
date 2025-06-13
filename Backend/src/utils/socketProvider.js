import { io } from "../index.js";

function socketProvider(eventName, data) {
  try {
    if (!io) {
      console.error("Socket.IO is not available.");
      return;
    }
    console.log(`Emitting event "${eventName}" with data:`, data);
    if (!eventName ||  !data) {
      console.error("Invalid eventName or data provided.");
    }
    
    io.emit(eventName, data);
    
  } catch (error) {
    console.error("Error emitting socket event:", error);
  }
}

export default socketProvider;