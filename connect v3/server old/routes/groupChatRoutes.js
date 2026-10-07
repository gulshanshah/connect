const express = require("express");
const {
  sendGroupMessage,
  getGroupMessages,
  getGroupChats,
  createGroup,
  addMembers,
  getGroupInfo,
} = require("../controllers/groupChatController");

const router = express.Router();

router.post("/send", sendGroupMessage);

router.get("/:groupId/messages", getGroupMessages);

router.get("/:userId", getGroupChats);

router.post("/group/create", createGroup);

router.put("/:groupId/add-members", addMembers);

router.get("/:groupId/group-info", getGroupInfo);

module.exports = router;
