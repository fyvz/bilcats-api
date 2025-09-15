import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
const ChatPage = mongoose.model("ChatPage", chatSchema, "chat_pages");
export default ChatPage;
