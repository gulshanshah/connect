const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Banned = require("../models/Banned");

const register = async (req, res) => {
    try {
        const { phone, password, username } = req.body;
        if (!phone || !password || !phone ) return res.status(400).json({ msg: "All fields are reuired" });

        const existingUser = await User.findOne({ $or: [{ phone }, { username }] });
        if (existingUser) return res.status(400).json({ msg: "Phone/Username already registered" });

        const newUser = new User({ phone, password, username });
        await newUser.save();

        res.status(201).json({ msg: "Registration Succesfull "});
    } catch (err) {
        console.error("error is: ", err);
        res.status(500).json({ msg: "Internal server error !!"});
    }
};

const login = async (req, res) => {
    try {
        const { identifier, password, fcmToken } = req.body;
        if (!identifier || !password || !fcmToken) return res.status(400).json({ msg: "Something is missing!!"});

        const user = await User.findOne({ $or: [{ phone: identifier }, { username: identifier }] });
        if (!user) return res.status(400).json({ msg: "User not found"});

        const idBanned = await User.findOne({ banned: true });
        if (idBanned) return res.status(400).json({ msg: "Your account has been banned"});


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Wrong password!!"});

        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) return res.status(500).json({ msg: "Token secrets not configured"});

        user.fcmToken = fcmToken;
        await user.save();

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10s" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "90d" });

        user.refreshToken = refreshToken;
        await user.save();

        res.status(202).json({
            accessToken,
            refreshToken,
            user: {
                username: user.username,
                profileImage: user.profileImage
            }
        });

    } catch (err) {
        console.error("error is: ", err);
        res.status(500).json({ msg: "Internal server error !!"});
    }
};


const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    console.log("🔄 Refresh token request received");
    console.log("➡️  Provided refresh token:", refreshToken);

    if (!refreshToken) {
      console.log("❌ No refresh token provided");
      return res.status(401).json({ msg: "Trying unauthorized access!!" });
    }

    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("✅ Refresh token verified");
    console.log("👤 Decoded user ID:", decode.id);

    const user = await User.findById(decode.id);

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    if (user.refreshToken !== refreshToken) {
      console.log("❌ Provided refresh token does not match the stored token");
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "20s",
    });

    console.log("✅ New access token generated for user:", user._id);

    res.status(201).json({ accessToken, refreshToken });

  } catch (err) {
    console.error("❌ Error during refresh:", err.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};


const logout = async (req, res) => {
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
};


module.exports = {
    register,
    login,
    refresh,
    logout
};