import connectDB from "./db/index.db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.routes.js";
import http from "http";
import { Server } from "socket.io";


dotenv.config({ path: "./env" });
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", router);


// socket connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.emit("message", "Welcome to the reservation-detector server!");
  
  socket.on("disconnect", (reason) => {
    console.log(`Client ${socket.id} disconnected. Reason: ${reason}`);
    switch (reason) {
      case "transport close":
        console.log("Client disconnected due to transport close.");
        break;
      case "ping timeout":
        console.log("Client disconnected due to ping timeout.");
        break;
      case "client namespace disconnect":
        console.log("Client manually disconnected.");
        break;
      default:
        console.log("Client disconnected for an unknown reason.");
        break;
    }
  });
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});
 

// Connect to the database and port listening
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 7777;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error in connecting to the database:", error);
  });


