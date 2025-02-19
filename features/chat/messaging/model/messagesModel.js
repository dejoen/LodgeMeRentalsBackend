const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
     ref:'Users'
  },

  messages:[
{
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
  },
  isRead:{
    type:mongoose.SchemaTypes.Boolean,
    default:false
  },
  
}
  ]


 
});


module.exports =  mongoose.model("Messages",messagesSchema)
