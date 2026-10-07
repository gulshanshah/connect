const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

const serviceAccount = require("../firebase-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

router.post("/send", async (req, res) => {
  const { fcmToken, title, body } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending FCM:", error);
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;
