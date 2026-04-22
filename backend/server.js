require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/auth", require("./routes/auth.routes"));


app.use("/api/messages", messageRoutes);

//

// DB connect
sequelize.sync()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});