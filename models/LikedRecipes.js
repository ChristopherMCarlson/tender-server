const mongoose = require("mongoose");

const likedRecipesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  recipes: [{ type: String }],
});

module.exports = mongoose.model("LikedRecipes", likedRecipesSchema);
