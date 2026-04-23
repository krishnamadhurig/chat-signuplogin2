const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const chatHandler = require("./handlers/chat");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // 🔐 Apply auth middleware
  io.use(socketAuth);

  // 🔌 Handle connections
  io.on("connection", (socket) => {
    chatHandler(io, socket);
  });

  return io;
};