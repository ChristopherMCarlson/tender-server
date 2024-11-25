const express = require("express");
const FriendCode = require("../models/FriendCode");
const FriendsList = require("../models/FriendsList");
const router = express.Router();
const { generateSlug } = require("random-word-slugs");

// Get friend code
router.get("/code", async (req, res) => {
  const userId = req.user.id;
  try {
    const friendCode = await FriendCode.findOne({ userId: userId });
    if (!friendCode) {
      // Generate new friend code
      const slug = generateSlug();
      console.log(slug);
      const newFriendCode = new FriendCode({ userId: userId, code: slug });
      await newFriendCode.save();
      return res.status(200).json({ code: newFriendCode.code });
    }
    res.status(200).json({ code: friendCode.code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get friends list
router.get("/list", async (req, res) => {
  const userId = req.user.id;
  try {
    const friendsList = await FriendsList.findOne({ userId });
    if (!friendsList) {
      return res.status(404).json({ message: "No friends found" });
    }
    res.status(200).json({ friendsList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add friend
router.post("/add", async (req, res) => {
  const userId = req.user.id;
  const code = req.body.code;
  try {
    const friendCode = await FriendCode.findOne({ code });
    if (!friendCode) {
      return res.status(404).json({ message: "Friend code not found" });
    }
    if (friendCode.userId === userId) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }
    const friendsList = await FriendsList.findOne({ userId });
    if (!friendsList) {
      const newFriendsList = new FriendsList({
        userId,
        friends: [friendCode.userId],
      });
      await newFriendsList.save();
    } else {
      friendsList.friends.push(friendCode.userId);
      await friendsList.save();
    }
    // Check if friend has you as a friend
    const friendFriendsList = await FriendsList.findOne({
      userId: friendCode.userId,
    });
    if (!friendFriendsList) {
      const newFriendFriendsList = new FriendsList({
        userId: friendCode.userId,
        friends: [userId],
      });
      await newFriendFriendsList.save();
    } else {
      //make sure you are not already their friend
      if (friendFriendsList.friends.includes(userId)) {
        return res.status(400).json({
          message: "You are already friends with this user",
        });
      } else {
        friendFriendsList.friends.push(userId);
        await friendFriendsList.save();
      }
    }
    res.status(200).json({ friendsList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
