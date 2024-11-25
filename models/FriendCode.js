const mongoose = require("mongoose");

const friendCodeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  code: { type: String, required: true },
});

module.exports = mongoose.model("FriendCode", friendCodeSchema);
