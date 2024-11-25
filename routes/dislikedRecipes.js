const express = require("express");
const FriendCode = require("../models/FriendCode");
const FriendsList = require("../models/FriendsList");
const DislikedRecipes = require("../models/DislikedRecipes");
const router = express.Router();

// Get disliked recipes
router.get("/", async (req, res) => {
  const userId = req.user.id;
  try {
    const dislikedRecipes = await DislikedRecipes.findOne({ userId });
    if (!dislikedRecipes) {
      return res.status(200).json({ dislikedRecipes: { recipes: [] } });
    }
    res.status(200).json({ dislikedRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add disliked recipe
router.post("/add", async (req, res) => {
  const userId = req.user.id;
  const recipeId = req.body.recipeId;
  try {
    const dislikedRecipes = await DislikedRecipes.findOne({ userId });
    if (!dislikedRecipes) {
      const newDislikedRecipes = new DislikedRecipes({
        userId,
        recipes: [recipeId],
      });
      await newDislikedRecipes.save();
    } else {
      dislikedRecipes.recipes.push(recipeId);
      await dislikedRecipes.save();
    }
    res.status(200).json({ dislikedRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove disliked recipe
router.post("/remove", async (req, res) => {
  const userId = req.user.id;
  const recipeId = req.body.recipeId;
  try {
    const dislikedRecipes = await DislikedRecipes.findOne({ userId });
    if (!dislikedRecipes) {
      return res.status(200).json({ dislikedRecipes: { recipes: [] } });
    }
    dislikedRecipes.recipes = dislikedRecipes.recipes.filter(
      (id) => id !== recipeId
    );
    await dislikedRecipes.save();
    res.status(200).json({ message: "Recipe removed from disliked recipes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check friends list for common disliked recipes
router.get("/common", async (req, res) => {
  const userId = req.user.id;
  try {
    const friendsList = await FriendsList.findOne({ userId });
    if (!friendsList) {
      return res.status(404).json({ message: "No friends found" });
    }
    const friendIds = friendsList.friends;
    // Get your disliked recipes
    const dislikedRecipes = await DislikedRecipes.findOne({ userId });
    if (!dislikedRecipes) {
      return res.status(200).json({ dislikedRecipes: { recipes: [] } });
    }
    const yourDislikedRecipes = dislikedRecipes.recipes;
    // Get common disliked recipes
    const commonDislikedRecipes = [];
    for (const friendId of friendIds) {
      const friendDislikedRecipes = await DislikedRecipes.findOne({
        userId: friendId,
      });
      if (!friendDislikedRecipes) {
        continue;
      }
      const commonRecipes = friendDislikedRecipes.recipes.filter((id) =>
        yourDislikedRecipes.includes(id)
      );
      commonDislikedRecipes.push({ friendId, commonRecipes });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
