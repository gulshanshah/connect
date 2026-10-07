const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    postImages: { 
      type: [String],
      default: []
    },
    caption: { 
      type: String, 
      default: '' 
    },
    likes: [{
      type: Schema.Types.ObjectId, 
      ref: 'User'
    }],
    comments: [{
      user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('Post', PostSchema);
