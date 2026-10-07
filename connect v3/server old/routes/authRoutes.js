const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, emailOrPhone, password } = req.body;
    if (!username || !emailOrPhone || !password) return res.status(400).json({ msg: "All fields are required" });

    const existingUser = await User.findOne({ $or: [{ emailOrPhone }, { username }] });
    if (existingUser) return res.status(400).json({ msg: "Username or Email/Phone already exists" });

    const newUser = new User({ username, emailOrPhone, password });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password, fcmToken } = req.body;
    if (!emailOrPhone || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ emailOrPhone });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      return res.status(500).json({ msg: "JWT Secret not configured" });
    }    

    if (fcmToken) {
      user.fcmToken = fcmToken;
      await user.save();
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ 
      accessToken, 
      refreshToken, 
      user: { 
        id: user._id, 
        username: user.username, 
        emailOrPhone: user.emailOrPhone, 
        profileImage: user.profileImage 
      } 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ msg: "Refresh Token required" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ msg: "Invalid or expired refresh token" });
  }
});


router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(400).json({ msg: "Invalid refresh token" });

    user.refreshToken = null;
    await user.save();

    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/protected", authMiddleware, (req, res) => {
  res.json({ msg: "You have accessed a protected route", user: req.user });
});

module.exports = router;
