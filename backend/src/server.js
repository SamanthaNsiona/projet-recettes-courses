import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { router as authRoutes } from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

app.get("/api/test", protect, (req, res) => {
  res.json({ message: "Route protégée OK 🔒", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
