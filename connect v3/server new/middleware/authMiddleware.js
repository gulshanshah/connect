const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("🔐 Incoming request to Middleware route");
  console.log("➡️  Authorization header:", authHeader);
  console.log("➡️  Extracted token:", token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ msg: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(401).json({ msg: "Invalid or expired access token" });
    }

    console.log("✅ Token verified successfully");
    console.log("👤 User from token payload:", user);

    req.user = user;
    next();
  });
};

module.exports = authMiddleware;