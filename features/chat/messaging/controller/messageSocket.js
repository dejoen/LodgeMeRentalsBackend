const userModel = require("../../../userRegistration/model/UsersModel");
const MessageModel = require("../model/messagesModel");
const mongoose = require("mongoose");
const MessageType = require("../../../../utils/MessageType.json");
const UsersModel = require("../../../userRegistration/model/UsersModel");

module.exports = (generalSocket, userSocket) => {
  console.log("called...now..");
  userSocket.on("send-message", (data) => {
    sendMessage(generalSocket, userSocket, data);
  });

  userSocket.on("message-sent", (data) => {
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

    if (!isRecieverIdValid) {
      userSocket.emit(
        "message-failed",
        JSON.stringify({
          message: "invalid data provided.",
        }),
      );
      return;
    }

    const isMessageTypeValid = Object.entries(MessageType).find(
      (data, index) => {
        return data[1] === message.type;
      },
    );

    if (!isMessageTypeValid) {
      userSocket.emit(
        "message-failed",
        JSON.stringify({
          message: "invalid data provided.",
        }),
      );
      return;
    }

    const receiver = await UsersModel.findOne({ _id: receiverId });

    if (!receiver) {
      userSocket.emit(
        "message-failed",
        JSON.stringify({
          message: "invalid data provided.",
        }),
      );
      return;
    }
    console.log(message);
    if (MessageType.TEXT === messageType) {
      /**
       * find message model were users are either receiver or sender
       */
      const messageModel = await MessageModel.findOne({
        $and: [
          {
            $or: [
              {
                sender: senderId,
              },
              {
                sender: receiverId,
              },
            ],
          },
          {
            $or: [
              {
                receiver: senderId,
              },
              {
                receiver: receiverId,
              },
            ],
          },
        ],
      });

      console.log(messageModel);
      if (messageModel) {
        const updatedMessages = messageModel.messages;

        updatedMessages.push({
          sender: senderId,
          receiver: receiverId,
          messageType: messageType,
          text: messageData,
          timeSent: timeStamp,
        });

        await messageModel.updateOne({ messages: updatedMessages });

        const messages = await MessageModel.find({
          $or: [
            {
              sender: senderId,
            },
            {
              receiver: senderId,
            },
          ],
        })
          .populate(
            "messages.receiver messages.sender sender receiver",
            "userProfile.firstName userProfile.lastName userProfile.profileImage userName isOnline",
          )
          .sort("updatedAt");

        userSocket.emit("message-sent", messages);
        generalSocket
          .to(receiver.userSocketConnectionId)
          .emit("message-sent", messages);
        return;
      }

      await new MessageModel({
        sender: senderId,
        receiver: receiverId,
        messages: [
          {
            sender: senderId,
            receiver: receiverId,
            messageType: messageType,
            text: messageData,
            timeSent: timeStamp,
          },
        ],
      }).save();

      const userMessages = await MessageModel.find({
        $or: [
          {
            sender: senderId,
          },
          {
            receiver: senderId,
          },
        ],
      })
        .populate(
          "messages.receiver messages.sender sender receiver",
          "userProfile.firstName userProfile.lastName userProfile.profileImage userName isOnline",
        )
        .sort("updatedAt");

      userSocket.emit("message-sent", userMessages);
      generalSocket
        .to(receiver.userSocketConnectionId)
        .emit("message-sent", userMessages);
    }
  } catch (err) {
    console.log(err);
  }
};

const messageSent = async (generalSocket, userSocket) => {};
