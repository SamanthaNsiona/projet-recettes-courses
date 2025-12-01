const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { router: authRoutes } = require("./src/routes/authRoutes");
const recipeRoutes = require("./src/routes/recipeRoutes");
const { protect } = require("./src/middleware/authMiddleware");

const shoppingListRoutes = require("./src/routes/shoppingListRoutes");
const shoppingItemRoutes = require("./src/routes/shoppingItemRoutes");
const courseRoutes = require("./src/routes/courseRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: "API Recettes & Courses OK" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/shopping-lists", shoppingListRoutes);
app.use("/api/shopping-items", shoppingItemRoutes);
app.use("/api/courses", courseRoutes);

app.get("/api/test", protect, (req, res) => {
  res.json({ message: "Route protégée OK 🔒", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
