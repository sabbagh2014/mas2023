const mongoose = require("mongoose");

const options = {
    collection: "message",
    timestamps: true,
  };

const MessageSchema = mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: { type: String, required: true },
    mediaType: {
        type: String,
        enum: ["text", "image", "pdf"],
        default: "text",
    },
    status: {
        type: String,
        enum: ["Read", "Unread"],
        default: "Unread",
    },
  },
  options
);

module.exports = mongoose.model("message", MessageSchema);