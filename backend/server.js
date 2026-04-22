require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);

// ==================
// SOCKET SETUP
// ==================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ==================
// SOCKET AUTH MIDDLEWARE
// ==================
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded; // attach user to socket

    next();
  } catch (err) {
    console.log("Socket auth error:", err.message);
    next(new Error("Authentication failed"));
  }
});

// ==================
// SOCKET CONNECTION
// ==================
io.on("connection", (socket) => {
  console.log("User connected:", socket.user.userId);

  // receive message from client
  socket.on("sendMessage", (data) => {
    console.log("Message received from:", socket.user.userId);

    // broadcast to all users
    io.emit("receiveMessage", {
      message: data.message,
      userId: socket.user.userId,
      time: new Date()
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.userId);
  });
});

// ==================
// MIDDLEWARE
// ==================
app.use(cors());
app.use(express.json());

// ==================
// ROUTES
// ==================
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// ==================
// DATABASE CONNECTION
// ==================
sequelize.sync()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

// ==================
// START SERVER
// ==================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});