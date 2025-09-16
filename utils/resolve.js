import mongoose from "mongoose";
import ChatPage from "../models/chatPage.js";

export async function resolveChatPage(idOrSlug) {
  if (!idOrSlug) return null;

  let page = null;
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    page = await ChatPage.findById(idOrSlug).select("_id slug").lean();
  }
  if (!page) {
    page = await ChatPage.findOne({ slug: idOrSlug }).select("_id slug").lean();
  }

  return page;
}
export async function resolveChatPageFull(idOrSlug) {
  if (!idOrSlug) return null;

  let page = null;
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    page = await ChatPage.findById(idOrSlug);
  }
  if (!page) {
    page = await ChatPage.findOne({ slug: idOrSlug });
  }

  return page;
}
