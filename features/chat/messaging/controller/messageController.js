const { default: mongoose } = require("mongoose");
const MessageModel = require("../model/messagesModel");
const UserModel = require("../../../userRegistration/model/UsersModel");

const getMessages = async (req, res, next) => {
  console.log("called me...");

  const user = req.user;

  if (!user) {
    res.status(500).json({
      title: "Messages of  user ",
      status: 500,
      successfull: false,
      message: "Server error please try again",
    });
    return;
  }

  const messages = await MessageModel.find({
    $or: [
      {
        sender: user._id,
      },
      {
        receiver: user._id,
      },
    ],
  })
    .populate(
      "messages.receiver messages.sender sender receiver",
      "userProfile.firstName userProfile.lastName userProfile.profileImage userName isOnline",
    )
    .sort("updatedAt");

  res.status(200).json({
    title: "Messages of  user ",
    status: 200,
    successfull: true,
    message: "Succesfully fetched.",
    userMessages: messages,
  });
};

module.exports = { getMessages };
