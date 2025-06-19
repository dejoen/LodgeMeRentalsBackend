const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },

        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
        messageType: {
          type: String,
        },
        text: {
          type: String,
        },
        video: {
          type: String,
        },
        image: {
          type: String,
        },
        timeSent: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Messages", messagesSchema);
