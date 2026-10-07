const mongoose = require('mongoose');
const PrivateChat = require("../models/PrivateChat");
const User = require("../models/User");

const sendMessage = async (req, res) => {
  const { currentUserId, otherUserId, text } = req.body;
  
  if (!currentUserId || !otherUserId || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let chat = await PrivateChat.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });

    if (!chat) {
      chat = new PrivateChat({
        participants: [currentUserId, otherUserId],
        messages: []
      });
    }

    const newMessage = {
      sender: currentUserId,
      text,
      createdAt: new Date()
    };

    chat.messages.push(newMessage);

    await chat.save();

    res.status(201).json({ message: "Message sent", newMessage });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { currentUserId, otherUserId } = req.query;
  if (!currentUserId || !otherUserId) {
    return res.status(400).json({ message: "Missing currentUserId or otherUserId" });
  }

  try {
    const chat = await PrivateChat.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    }).populate("messages.sender", "username");

    if (!chat) {
      return res.json({ messages: [], message: "No chats available" });
    }

    const transformedMessages = chat.messages.map((msg) => ({
      sender: msg.sender._id.toString(),
      text: msg.text,
      createdAt: msg.createdAt
    }));

    res.json({ messages: transformedMessages });
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getChats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      console.error('[2] Missing userId parameter');
      return res.status(400).json({ message: "userId query parameter is required" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const chats = await PrivateChat.find({ participants: userObjectId })
      .populate({
        path: 'participants',
        match: { _id: { $ne: userObjectId } },
        select: 'username profileImage',
        model: User
      })
      .sort({ 'messages.createdAt': -1 });

    const chatList = chats.map(chat => {

      const otherUser = chat.participants[0] || {};

      const lastMessage = chat.messages[chat.messages.length - 1] || { 
        text: "", 
        createdAt: chat.createdAt 
      };

      return {
        id: chat._id,
        otherUser: {
          id: otherUser._id || null,
          username: otherUser.username || "Unknown User",
          profileImage: otherUser.profileImage || "https://example.com/default-profile.jpg"
        },
        lastMessage: {
          text: lastMessage.text,
          createdAt: lastMessage.createdAt
        }
      };
    });
    
    res.status(200).json(chatList);
  } catch (error) {
    console.error('[10] Error in getChats:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

module.exports = { sendMessage, getMessages, getChats };
