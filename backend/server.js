require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

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

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // listen for messages
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);

    // broadcast to ALL users
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
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
// DB CONNECT
// ==================
sequelize.sync()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

// ==================
// START SERVER
// ==================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});