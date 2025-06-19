const mongoose = require("mongoose");

const unReadMessagesSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.SchemaTypes.ObjectId,
    unique: [true, "inbox owner should be unique."],
  },
  receiverId: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  ],
});
