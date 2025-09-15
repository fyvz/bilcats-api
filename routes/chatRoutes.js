import express from "express";
import Message from "../models/Message.js";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import ChatPage from "../models/chatPage.js";

const router = express.Router();

// @route          GET /api/messages/:chatpageid
// @description    Get all messages for a given chat page
// @access         Public TODO:ADD QUERY
router.get("/:chatpageid", async (req, res, next) => {
  try {
    const { chatPageId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      //To avoid the weird ObjectId error
      res.status(404);
      throw new Error("Invalid page not found");
    }
    const messages = await Message.find({ page: chatPageId }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route          POST /api/messages
// @description    Post new message to a chat page
// @access         Public TODO:ADD QUERY
router.post("/:chatpageid", protect, async (req, res, next) => {
  try {
    const { chatpageid: chatPageId } = req.params;
    console.log(chatPageId);
    if (!mongoose.Types.ObjectId.isValid(chatPageId)) {
      //To avoid the weird ObjectId error
      res.status(404);
      throw new Error("Invalid - page not found");
    }

    // We have guaranteed that the page exists

    const { content } = req.body || {};
    if (!content?.trim()) {
      res.status(400);
      throw new Error("Please fill all the fields: content");
    }
    const newMessage = new Message({
      user: req.user._id,
      chatpage: chatPageId,
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
