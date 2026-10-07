const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    const users = await User.find({ _id: { $ne: userId } }).select('name username profileImage');

    const formattedUsers = users.map(u => ({
      userId: u._id,
      name: u.name,
      username: u.username,
      profileImage: u.profileImage,
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;
