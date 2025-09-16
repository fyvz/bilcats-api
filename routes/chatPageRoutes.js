import express from "express";
import mongoose from "mongoose";
import ChatPage from "../models/chatPage.js";
import { resolveChatPageFull } from "../utils/resolve.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route          GET /api/chatpages
// @description    Get all chat pages
// @access         Public
router.get("/", async (req, res, next) => {
  try {
    const chatPages = await ChatPage.find().sort({ createdAt: -1 });
    res.json(chatPages);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route          POST /api/chatpages
// @description    Create a new chat page
// @access         Public (will be protected later)
router.post("/", protect, async (req, res, next) => {
  try {
    const { title, description, slug } = req.body || {};
    if (!title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const newChatPage = new ChatPage({
      title,
      description: description ? description : "",
      slug: slug ? slug : title.toLowerCase().replace(/ /g, "-"),
    });

    const savedChatPage = await newChatPage.save();
    res.status(201).json(savedChatPage);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route          DELETE /api/chatpageslug
// @description    Delete a chat page using the slug or id
// @access         Public (will be protected later)
router.delete("/:chatidorslug", protect, async (req, res, next) => {
  try {
    const { chatidorslug: idOrSlug } = req.params;
    const chatPage = await resolveChatPageFull(idOrSlug);
    if (!chatPage) return res.status(404).json({ message: "Page not found" });

    if (!chatPage) {
      res.status(404);
      throw new Error("Chat page not found");
    }

    //Fetch some info to reaffirm what happened
    const targetId = chatPage._id;
    const targetSlug = chatPage.slug;

    await chatPage.deleteOne();
    res.json({ message: "Chat page deleted successfully", removed: { _id: targetId, slug: targetSlug } });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
