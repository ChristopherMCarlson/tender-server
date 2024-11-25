const express = require("express");
const FriendCode = require("../models/FriendCode");
const FriendsList = require("../models/FriendsList");
const LikedRecipes = require("../models/LikedRecipes");
const router = express.Router();

// Get liked recipes
router.get("/", async (req, res) => {
  const userId = req.user.id;
  try {
    const likedRecipes = await LikedRecipes.findOne({ userId });
    if (!likedRecipes) {
      return res.status(200).json({ likedRecipes: { recipes: [] } });
    }
    res.status(200).json({ likedRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add liked recipe
router.post("/add", async (req, res) => {
  const userId = req.user.id;
  const recipeId = req.body.recipeId;
  try {
    const likedRecipes = await LikedRecipes.findOne({ userId });
    if (!likedRecipes) {
      const newLikedRecipes = new LikedRecipes({
        userId,
        recipes: [recipeId],
      });
      await newLikedRecipes.save();
    } else {
      likedRecipes.recipes.push(recipeId);
      await likedRecipes.save();
    }
    res.status(200).json({ likedRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove liked recipe
router.post("/remove", async (req, res) => {
  const userId = req.user.id;
  const recipeId = req.body.recipeId;
  try {
    const likedRecipes = await LikedRecipes.findOne({ userId });
    if (!likedRecipes) {
      return res.status(200).json({ likedRecipes: { recipes: [] } });
    }
    likedRecipes.recipes = likedRecipes.recipes.filter((id) => id !== recipeId);
    await likedRecipes.save();
    res.status(200).json({ message: "Recipe removed from liked recipes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check friends list for common liked recipes
router.get("/common", async (req, res) => {
  const userId = req.user.id;
  try {
    const friendsList = await FriendsList.findOne({ userId });
    if (!friendsList) {
      return res.status(404).json({ message: "No friends found" });
    }
    const friendIds = friendsList.friends;
    // Get your liked recipes
    const likedRecipes = await LikedRecipes.findOne({ userId });
    if (!likedRecipes) {
      return res.status(200).json({ likedRecipes: { recipes: [] } });
    }
    const yourLikedRecipes = likedRecipes.recipes;
    // Get common liked recipes
    console.log("getting common liked recipes");
    const commonLikedRecipes = [];
    const fiendsLikedRecipes = await LikedRecipes.find({
      userId: { $in: friendIds },
    });
    fiendsLikedRecipes.forEach((friendLikedRecipes) => {
      friendLikedRecipes.recipes.forEach((recipe) => {
        if (yourLikedRecipes.includes(recipe)) {
          commonLikedRecipes.push(recipe);
        }
      });
    });
    res.status(200).json({ commonLikedRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
