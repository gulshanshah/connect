const mongoose = require("mongoose");
const { Schema } = mongoose;

const BannedSchema = new Schema({
    fcmToken: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Banned", BannedSchema);