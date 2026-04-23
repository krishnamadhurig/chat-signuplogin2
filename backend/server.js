require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const http = require("http");

const app = express();
const server = http.createServer(app);

// ==================
// SOCKET IMPORT
// ==================
require("./socket-io")(server);

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