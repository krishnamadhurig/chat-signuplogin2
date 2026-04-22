const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const cleanToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    req.userId = decoded.userId; // ✅ FIXED

    next();

  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};