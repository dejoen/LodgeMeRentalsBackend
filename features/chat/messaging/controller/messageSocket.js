const userModel = require("../../../userRegistration/model/UsersModel");
const MessageModel = require("../model/messagesModel");
const mongoose = require("mongoose");
const MessageType = require("../../../../utils/MessageType.json");
const UsersModel = require("../../../userRegistration/model/UsersModel");

module.exports = (generalSocket, userSocket) => {
  console.log("called...now..");
  

  userSocket.on("send-message", data => {
    console.log('messages')
    console.log(data)
    sendMessage(generalSocket, userSocket, data);
  });

  userSocket.on("message-delivered", data => {
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
      const  userMessages = await MessageModel.findOne({
          senderId:[senderId || receiverId],
          receiverId:[receiverId || senderId]
        })
 
        console.log(userMessages)
        if(userMessages){
          const messages = userMessages.messages

          messages.push({
            messageType:messageType,
      text:messageData,
      timeSent:timeStamp 
          })

   await MessageModel.findByIdAndUpdate({
    _id:userMessages._id
   },{messages})

         const newMessages = await MessageModel.findOne({
          senderId:[senderId || receiverId],
          receiverId:[receiverId || senderId]
        }).populate(['senderId','receiverId'])
        
        
        console.log(newMessages)
    
        userSocket.emit("message-sent", JSON.stringify(newMessages));
        generalSocket.to(receiver.userSocketConnectionId).emit("message-sent",JSON.stringify(newMessages))

        return 
        }


     await new MessageModel({
      senderId:senderId,
      receiverId:receiverId,
    messages:{
      messageType:messageType,
      text:messageData,
      timeSent:timeStamp
    }
    }).save()

     
    const newMessages = await MessageModel.findOne({
      senderId:[senderId || receiverId],
      receiverId:[receiverId || senderId]
    }).populate('senderId')
    
    
//console.log(newMessages)

    userSocket.emit("message-sent", JSON.stringify(newMessages));
    generalSocket.to(receiver.userSocketConnectionId).emit("message-sent",JSON.stringify(newMessages))
}


  } catch (err) {
    console.log(err);
  }

  
};

const messageSent = async (generalSocket, userSocket) => {};
