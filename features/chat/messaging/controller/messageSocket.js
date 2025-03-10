const userModel = require ('../../../userRegistration/model/UsersModel');
const MessageModel = require ('../model/messagesModel');
const mongoose = require ('mongoose');
const MessageType = require ('../../../../utils/MessageType.json');
const UsersModel = require ('../../../userRegistration/model/UsersModel');
const NotificationModel = require('../model/NotificationModel')

module.exports = (generalSocket, userSocket) => {
  console.log ('called...now..');

  userSocket.on ('send-message', data => {
    console.log ('messages');
    console.log (data);
    sendMessage (generalSocket, userSocket, data);
  });

  userSocket.on ('message-delivered', data => {
    // messageSent(generalSocket, userSocket);
  });

userSocket.on('typing',data => {
  sendIsTyping(generalSocket,userSocket,data)
})
};


const sendMessage = async (generalSocket, userSocket, data) => {
  const message = JSON.parse (data);
  try {
    const receiverId = message.receiver;
    const senderId = userSocket.user._id;
    const messageType = message.type;
    const messageData = message.data;
    const timeStamp = message.time;

    const isRecieverIdValid = mongoose.Types.ObjectId.isValid (receiverId);

    if (!isRecieverIdValid) {
      userSocket.emit (
        'message-failed',
        JSON.stringify ({
          message: 'invalid data provided.',
        })
      );
      return;
    }

    const isMessageTypeValid = Object.entries (
      MessageType
    ).find ((data, index) => {
      return data[1] === message.type;
    });

    if (!isMessageTypeValid) {
      userSocket.emit (
        'message-failed',
        JSON.stringify ({
          message: 'invalid data provided.',
        })
      );
      return;
    }

    const receiver = await UsersModel.findOne ({_id:receiverId});

    if (!receiver) {
      userSocket.emit (
        'message-failed',
        JSON.stringify ({
          message: 'invalid data provided.',
        })
      );
      return;
    }

    if (MessageType.TEXT === messageType) {

      const userMessages = await MessageModel.findOne ({
        $and:[
          {
            $or:[
              {senderId},
              {senderId:receiverId}
            ]
          },
          {
            $or:[
              {receiverId},
              {receiverId:senderId}
            ]
           
          }
         ]
      
      });

      console.log (userMessages);
      if (userMessages) {
        const messages = userMessages.messages;

        messages.push ({
          senderId,
          receiverId,
          messageType: messageType,
          text: messageData,
          timeSent: timeStamp,
        });

        await MessageModel.findByIdAndUpdate (
          {
            _id: userMessages._id,
          },
          {messages}
        );

        const newMessages = await MessageModel.findOne ({
          $and:[
            {
              $or:[
                {senderId},
                {senderId:receiverId}
              ]
            },
            {
              $or:[
                {receiverId},
                {receiverId:senderId}
              ]
             
            }
           ]
        }).populate (['senderId', 'receiverId']);

        console.log (newMessages);

      generalSocket
        .to (receiver.userSocketConnectionId)
        .emit ('message-sent', JSON.stringify (newMessages));

        userSocket.emit ('message-sent', JSON.stringify (newMessages));
         

       let  notification = await new NotificationModel({
          userId:receiverId,
          notificationTitle:"New Message",
          notificationBody:`You have a new message from ${receiver.userName ?? receiver.userProfile.firstName}`,
          notificationType:'message',
          sender:senderId,
          notificationTime:Date.now()
         }).save()
          notification = await NotificationModel.find({
            userId:receiver._id
          })

         generalSocket
         .to (receiver.userSocketConnectionId)
         .emit ('notification', JSON.stringify (notification));
       


        return;
      }

      await new MessageModel ({
        senderId: senderId,
        receiverId: receiverId,
        messages: {
          senderId,
          receiverId,
          messageType: messageType,
          text: messageData,
          timeSent: timeStamp,
        },
      }).save ();

      const newMessages = await MessageModel.findOne ({
        $and:[
          {
            $or:[
              {senderId},
              {senderId:receiverId}
            ]
          },
          {
            $or:[
              {receiverId},
              {receiverId:senderId}
            ]
           
          }
         ]
      }).populate (['senderId', 'receiverId']);

      console.log(newMessages)
   

      generalSocket
      .to (receiver.userSocketConnectionId)
      .emit ('message-sent', JSON.stringify (newMessages));
      
      userSocket.emit ('message-sent', JSON.stringify (newMessages));
      
      let  notification = await new NotificationModel({
        userId:receiverId,
        notificationTitle:"New Message",
        notificationBody:`You have a new message from ${receiver.userName ?? receiver.userProfile.firstName}`,
        notificationType:'message',
        sender:senderId,
        notificationTime:Date.now()
       }).save()
        notification = await NotificationModel.find({userId:receiver._id})

       generalSocket
       .to (receiver.userSocketConnectionId)
       .emit ('notification', JSON.stringify (notification));
    
     
    
    }
  } catch (err) {
    console.log (err);
  }
};

const  sendIsTyping = async (generalSocket, userSocket, data) => {
    
  const d = JSON.parse (data);
  try {
    const receiverId = d.receiverId;
    const senderId = userSocket.user._id;

    const isRecieverIdValid = mongoose.Types.ObjectId.isValid (receiverId);

    if (!isRecieverIdValid) {
      userSocket.emit (
        'message-failed',
        JSON.stringify ({
          message: 'invalid data provided.',
        })
      );
      return;
    }

   

    const receiver = await UsersModel.findOne ({_id:receiverId});

    if (!receiver) {
      userSocket.emit (
        'message-failed',
        JSON.stringify ({
          message: 'invalid data provided.',
        })
      );
      return;
    }



    generalSocket
    .to (receiver.userSocketConnectionId)
    .emit ('typing', JSON.stringify ({
       senderId,
       typing:d.typing
    }));

    

    
  } catch (err) {
    console.log (err);
  }


}

const messageSent = async (generalSocket, userSocket) => {};
