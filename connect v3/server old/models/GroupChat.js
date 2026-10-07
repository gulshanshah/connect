const mongoose = require("mongoose");

const groupChatSchema = new mongoose.Schema({
    groupName: {
      type: String,
      required: true
    },
    groupImage: {
      type: String,
      default: "uploads/group.png",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
      }
    ],
    admins: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, { timestamps: true });
  
  const GroupChat = mongoose.model("GroupChat", groupChatSchema);
  
  module.exports = GroupChat;
  