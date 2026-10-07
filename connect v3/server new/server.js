const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
connectDB();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/test", authMiddleware, testRoutes);

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running... Port: ${port}`));