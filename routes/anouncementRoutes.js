import express from "express";
import Anouncement from "../models/Anouncement.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route          GET /api/anouncements
// @description    Get all anouncements
// @access         Public
router.get("/", async (req, res, next) => {
  try {
    const anouncements = await Anouncement.find()
      .populate("author", "name")
      .populate("cat", "name")
      .sort({ date: -1 });
    res.json(anouncements);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route          POST /api/anouncements
// @description    Create a new anouncement
// @access         Protected (use protect middleware)
router.post("/", protect, async (req, res, next) => {
  try {
    const { author, date, cat, category, title, content, following } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!author || !cat || !category || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newAnouncement = new Anouncement({
      author,
      date: date || Date.now(),
      cat,
      category,
      title,
      content,
      following: following || 0,
    });

    const savedAnouncement = await newAnouncement.save();
    res.status(201).json(savedAnouncement);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;