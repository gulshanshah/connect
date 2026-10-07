require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandler = require("./realtime/socket");
const notificationRoutes = require("./realtime/notification");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const privateChatRoutes = require('./routes/privateChatRoutes');
const groupChatRoutes = require('./routes/groupChatRoutes');
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});

connectDB();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
require('./deleting/cleanup');

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use('/api/privateChat', privateChatRoutes);
app.use('/api/groupChat', groupChatRoutes);
app.use("/api/user", userRoutes);

app.use("/api/payment", paymentRoutes);

app.use('/api/notification', notificationRoutes);

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
