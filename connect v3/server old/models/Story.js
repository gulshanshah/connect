const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  postedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Story', storySchema);
