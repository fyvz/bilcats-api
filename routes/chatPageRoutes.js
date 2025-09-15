import express from "express";
import mongoose from "mongoose";
import ChatPage from "../models/chatPage.js";
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
router.post("/", async (req, res, next) => {
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

// @route          DELETE /api/chatpages
// @description    Delete a chat page
// @access         Public (will be protected later)
// router.delete("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       //To avoid the weird ObjectId error
//       res.status(404);
//       throw new Error("Chat page not found");
//     }
//     const chatPage = await ChatPage.findById(id);
//     if (!chatPage) {
//       res.status(404);
//       throw new Error("Chat page not found");
//     }

//     // TODO: Check authorization,
//     await chatPage.deleteOne();
//     res.json({ message: "Chat page removed successfully" });
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// });

// @route          DELETE /api/chatpageslug
// @description    Delete a chat page using the slug
// @access         Public (will be protected later)
router.delete("/:chatpageslug", async (req, res, next) => {
  try {
    const { chatpageslug } = req.params;
    const chatPage = await ChatPage.findOne({ slug: chatpageslug });
    if (!chatPage) {
      res.status(404);
      throw new Error("Chat page not found");
    }
    await chatPage.deleteOne();
    res.json({ message: "Chat page removed successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
