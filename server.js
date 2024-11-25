const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const friends = require("./routes/friends");
const likedRecipes = require("./routes/likedRecipes");
const dislikedRecipes = require("./routes/dislikedRecipes");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);

// Protected Route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: `Welcome, user ${req.user.id}!` });
});

app.use("/api/friends", authMiddleware, friends);

app.use("/api/likedRecipes", authMiddleware, likedRecipes);

app.use("/api/dislikedRecipes", authMiddleware, dislikedRecipes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
