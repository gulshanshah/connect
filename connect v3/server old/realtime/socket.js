const User = require("../models/User");
const Group = require("../models/GroupChat");


module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("register", async (userId) => {
            try {
              const user = await User.findById(userId);
              if (user) {
                user.socketId = socket.id;
                user.online = true;
                await user.save();
                console.log(`User ${userId} registered on socket ${socket.id}`);
              }
            } catch (err) {
              console.error("Error registering socket ID:", err);
            }
          });

          
        socket.on("privateMessage", async ({ senderId, receiverId, message }) => {
            console.log("Private message to", receiverId);
            try {
              const sender = await User.findById(senderId);
              const receiver = await User.findById(receiverId);
          
              if (!receiver) return console.log("Receiver not found");
          
              if (receiver.socketId) {
                console.log("Receiver is online");
        
                  io.to(receiver.socketId).emit("privateMessage", { senderId, message });
            
              } else if (receiver.fcmToken) {
                console.log("Receiver is offline, sending FCM...");
                console.log("FCM Token:", receiver.fcmToken);
                const fcmPayload = {
                  fcmToken: receiver.fcmToken,
                  title: sender.username,
                  body: message,
                };
          
                await fetch("http://192.168.73.246:5000/api/notification/send", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(fcmPayload),
                });
              } else {
                console.log(`No FCM token for user ${receiverId}`);
              }
            } catch (err) {
              console.error("Error sending private message:", err);
            }
          });
          
          socket.on("groupMessage", async ({ groupId, senderId, senderUsername, senderImage, text }) => {
            try {
              const group = await Group.findById(groupId).populate("members");
              const sender = await User.findById(senderId);
          
              if (!group) return;
          
              const createdAt = new Date().toISOString();
              group.members.forEach(async (member) => {
                if (member._id.equals(senderId)) return;
          
                if (member.socketId) {
                    io.to(member.socketId).emit(`groupMessage-${groupId}`, {
                      groupId,
                      senderId,
                      senderUsername,
                      senderImage,
                      text,
                      createdAt,
                    });
                } else if (member.fcmToken) {
                  const fcmPayload = {
                    fcmToken: member.fcmToken,
                    title: group.groupName,
                    body: `${senderUsername}: ${text}`,
                  };
                  console.log("FCM Payload:", fcmPayload);
          
                  await fetch("http://192.168.73.246:5000/api/notification/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(fcmPayload),
                  });
                }
              });
            } catch (err) {
              console.error("Error handling group message:", err);
            }
          });
  
          
        socket.on("disconnect", async () => {
            try {
              const user = await User.findOne({ socketId: socket.id });
              if (user) {
                user.socketId = "";
                user.online = false;
                await user.save();
                console.log(`User ${user._id} disconnected from socket ${socket.id}`);
              }
            } catch (err) {
              console.error("Error handling disconnect:", err);
            }
          });
        });
};
