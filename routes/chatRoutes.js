import express from "express";
import Message from "../models/Message.js";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import ChatPage from "../models/chatPage.js";
import { resolveChatPage } from "../utils/resolve.js";

const router = express.Router();

// @route          GET /api/messages/:chatidorslug
// @description    Get all messages for a given chat page id or slug
// @access         Public TODO:ADD QUERY
router.get("/:chatidorslug", async (req, res, next) => {
  try {
    const { chatidorslug: idOrSlug } = req.params;
    const page = await resolveChatPage(idOrSlug);
    if (!page) return res.status(404).json({ message: "Page not found" });

    const limit = Math.min(parseInt(req.query.limit ?? "50", 10), 100);
    const messages = await Message.find({ chatpage: page._id }).sort({ createdAt: -1 }).limit(limit).populate("user", "username").lean();

    res.json({ pageId: page._id.toString(), slug: page.slug, messages });
  } catch (err) {
    next(err);
  }
});

// @route          POST /api/messages/:chatidorslug
// @description    Post new message to a chat page given its id or slug
// @access         Public TODO:ADD QUERY
// @requires       user, page, content
router.post("/:chatidorslug", protect, async (req, res, next) => {
  try {
    const { chatidorslug: idOrSlug } = req.params;
    const page = await resolveChatPage(idOrSlug);
    if (!page) return res.status(404).json({ message: "Page not found" });

    // We have guaranteed that the page exists

    const { content } = req.body || {};
    if (!content?.trim()) {
      res.status(400);
      throw new Error("Please fill all the fields: content");
    }

    // Check if the user id exists
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      res.status(400);
      throw new Error("User not found");
    }

    const newMessage = new Message({
      user: req.user._id,
      chatpage: page,
      content,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
