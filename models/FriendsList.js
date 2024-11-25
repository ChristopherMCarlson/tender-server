const mongoose = require("mongoose");

const friendsListSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  friends: [{ type: String }],
});

module.exports = mongoose.model("FriendsList", friendsListSchema);
