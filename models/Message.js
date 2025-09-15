import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // We will enable this later
    },
    chatpage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatPage",
      required: true, // We will enable this later
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageSchema, "chat_messages");
export default Message;
