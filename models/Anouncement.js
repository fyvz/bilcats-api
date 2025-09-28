import mongoose from "mongoose";

const anouncementSchema = new mongoose.Schema(
  {
    author: {
        type: Number,
        required: true,
      /*type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,*/

    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    cat: {
        type: String,
        required: true,
    },
    category: {
      type: String,
      enum: ["info", "emergency", "update", "event"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    following: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

anouncementSchema.index({ cat: 1, author: 1, date: -1 });

const Anouncement =
  mongoose.models.anouncement ||
  mongoose.model("anouncement", anouncementSchema, "anouncements");

export default Anouncement;