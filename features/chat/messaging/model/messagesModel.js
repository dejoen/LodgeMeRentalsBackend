const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId
  },

  messageType: {
    type: String
  },
  text: {
    type: String
  },
  video: {
    type: String
  },
  image: {
    type: String
  },
  timeSent: {
    type: Date,
    default: Date.now()
  }
});


module.exports =  mongoose.model("Messages",messagesSchema)
