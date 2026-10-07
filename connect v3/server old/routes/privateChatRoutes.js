const express = require("express");
const {
  sendMessage,
  getMessages,
  getChats,
} = require("../controllers/privateChatController");

const router = express.Router();

router.post("/send", sendMessage);

router.get("/messages", getMessages);

router.get("/", getChats);

module.exports = router;
