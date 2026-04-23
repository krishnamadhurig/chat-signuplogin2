const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded; // attach user

    next();
  } catch (err) {
    console.log("Socket auth error:", err.message);
    next(new Error("Authentication failed"));
  }
};