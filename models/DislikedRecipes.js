const mongoose = require("mongoose");

const dislikedRecipesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  recipes: [{ type: String }],
});

module.exports = mongoose.model("DislikedRecipes", dislikedRecipesSchema);
