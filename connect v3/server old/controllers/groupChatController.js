const mongoose = require('mongoose');
const GroupChat = require("../models/GroupChat");
const User = require("../models/User");

const createGroup = async (req, res) => {
  try {
    const { groupName, members, createdBy } = req.body;

    if (!groupName || !Array.isArray(members) || members.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Group name and at least 2 members are required.",
      });
    }

    const allMembers = [...new Set([...members, createdBy])];

    const newGroup = new GroupChat({
      groupName,
      members: allMembers,
      admins: [createdBy],
    });

    const savedGroup = await newGroup.save();

    res.status(201).json({
      success: true,
      message: "Group created successfully.",
      group: savedGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating group.",
    });
  }
};


const getGroupChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const groups = await GroupChat.find({ members: userId })
      .populate({
        path: "messages.sender",
        model: "User",
        select: "_id username",
      })
      .lean();

    const formattedGroups = groups.map(group => {
      const lastMessage = group.messages[group.messages.length - 1];

      return {
        id: group._id,
        groupName: group.groupName,
        groupImage: group.groupImage,
        lastMessage: lastMessage ? {
          senderId: lastMessage.sender?._id || null,
          senderUsername: lastMessage.sender?.username || "Unknown",
          text: lastMessage.text,
          time: lastMessage.createdAt,
        } : null,
      };
    });

    res.status(200).json({ groups: formattedGroups });

  } catch (err) {
    console.error("Error in getUserGroups:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await GroupChat.findById(groupId)
      .populate({
        path: 'messages.sender',
        model: 'User',
        select: 'username profileImage',
      })
      .lean();

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const response = {
      groupId: group._id,
      groupName: group.groupName,
      groupImage: group.groupImage,
      memberCount: group.members.length,
      messages: group.messages.map(msg => ({
        senderId: msg.sender._id,
        senderUsername: msg.sender.username,
        senderImage: msg.sender.profileImage,
        text: msg.text,
        createdAt: msg.createdAt,
      })),
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching group messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const sendGroupMessage = async (req, res) => {
  const { groupId, senderId, text } = req.body;

  if (!groupId || !senderId || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const group = await GroupChat.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const newMessage = {
      sender: senderId,
      text,
      createdAt: new Date()
    };

    group.messages.push(newMessage);

    await group.save();

    res.status(201).json({ message: "Message sent", newMessage });
  } catch (err) {
    console.error("Error sending group message:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const addMembers = async (req, res) => {
  const { groupId } = req.params;
  const { members } = req.body;

  console.log('Group Id: ', groupId);
  console.log('Members: ', members);

  if (!Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ message: 'No members provided' });
  }

  try {
    const group = await GroupChat.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const existing = group.members.map(id => id.toString());
    const toAdd = members.filter(id => !existing.includes(id));

    if (toAdd.length === 0) {
      return res
        .status(200)
        .json({ message: 'No new members to add', members: group.members });
    }

    group.members.push(...toAdd);
    await group.save();

    return res
      .status(200)
      .json({ message: 'Members added', members: group.members });
  } catch (err) {
    console.error('Error adding members:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

  
const getGroupInfo = async (req, res) => {
  try {
    const group = await GroupChat.findById(req.params.groupId)
      .populate({
        path: 'members',
        select: '_id name username profileImage'
      });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({ group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
   createGroup, 
   getGroupChats, 
   getGroupMessages, 
   sendGroupMessage, 
   addMembers, 
   getGroupInfo 
  };
