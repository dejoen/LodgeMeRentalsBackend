const userModel = require("../../../userRegistration/model/UsersModel");
const MessageModel = require("../model/messagesModel");
const mongoose = require("mongoose");
const MessageType = require("../../../../utils/MessageType.json");
const UsersModel = require("../../../userRegistration/model/UsersModel");

module.exports = (generalSocket, userSocket) => {
  console.log("called...now..");
  userSocket.on("send-message", data => {
   
    sendMessage(generalSocket, userSocket, data);
  });

  userSocket.on("message-sent", data => {
   // messageSent(generalSocket, userSocket);
  });
};

const sendMessage = async (generalSocket, userSocket, data) => {
  const message = JSON.parse(data);
  try {
    const receiverId = message.receiver;
    const senderId = userSocket.user._id;
    const messageType = message.type;
    const messageData = message.data;
    const timeStamp = message.time;

    const isRecieverIdValid = mongoose.Types.ObjectId.isValid(receiverId);

    if(!isRecieverIdValid){
      userSocket.emit("message-failed",JSON.stringify({
            message:"invalid data provided."
      }))
      return
    }


    const isMessageTypeValid = Object.entries(MessageType).find((data, index) => {
      
      return data[1] === message.type
    });

    if(!isMessageTypeValid){
      userSocket.emit("message-failed",JSON.stringify({
            message:"invalid data provided."
      }))
      return
    }
    
    const receiver = await UsersModel.findOne({_id:receiverId})

    if(!receiver){
      userSocket.emit("message-failed",JSON.stringify({
            message:"invalid data provided."
      }))
      return
    }

      if(MessageType.TEXT === messageType){

     await new MessageModel({
      sender:senderId,
      receiver:receiverId,
      messageType:messageType,
      text:messageData,
      timeSent:timeStamp
    }).save()

     
    const messages = await MessageModel.find({
      sender:[senderId || receiverId],
      receiver:[receiverId || senderId]
    })
    


    userSocket.emit("message-sent", JSON.stringify(messages));
    generalSocket(receiver.userSocketConnectionId).emit("message-sent",JSON.stringify(messages))
}


  } catch (err) {
    console.log(err);
  }

  
};

const messageSent = async (generalSocket, userSocket) => {};
