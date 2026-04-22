const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check existing user
    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    res.json({
      message: "Signup successful",
      userId: user.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { email: loginId },
          { phone: loginId }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🎟 JWT Token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};