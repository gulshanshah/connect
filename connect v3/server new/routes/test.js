


const express = require("express");
const router = express.Router();

const log = (...args) => {
  console.log(...args);
};

router.post('/test', async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  log("📩 Incoming POST /test");
  log("🔐 Authenticated user ID:", userId);
  log("📝 Request body:", { title, content });

  try {

    log("✅ Post created successfully.");
    log("........................................................................................................................");
    res.status(201).json({ msg: 'Post created', title, userId });

  } catch (error) {
    log("❌ Error creating post:", error.message);
    res.status(500).json({ msg: 'Server error while creating post' });
  }
});

module.exports = router;
