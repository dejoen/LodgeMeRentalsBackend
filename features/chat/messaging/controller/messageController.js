
  const { default: mongoose } = require("mongoose")
const MessageModel = require("../model/messagesModel")
const UserModel = require("../../../userRegistration/model/UsersModel")

const getMessages = async (req,res,next) => {

    console.log("called me...")

    const  user = req.user 

    const  personUserChatted = req.body.receiverId

    if(!user){
        res.status(500).json({
            title:"Messages of  user ",
            status:500,
            successfull:false,
            message:"Server error please try again"
        })
        return
    }
    
    const isReceiverIdValid = mongoose.Types.ObjectId.isValid(personUserChatted)

    if(!isReceiverIdValid){
        res.status(400).json({
            title:"Messages of  user ",
            status:400,
            successfull:false,
            message:"Invalid receiverId provided."
        })
        return
    }

     const authenticatedReceiver = await UserModel.findOne({_id:personUserChatted})

      if(!authenticatedReceiver){
        res.status(400).json({
            title:"Messages of  user ",
            status:400,
            successfull:false,
            message:"Invalid receiverId provided."
        })
        return
      }

      const messages = await MessageModel.find({
        sender:[user._id || personUserChatted],
        receiver:[personUserChatted || user._id]
      })


      res.status(200).json({
        title:"Messages of  user ",
        status:200,
        successfull:true,
        message:"Succesfully fetched.",
        messages
      })



    
}


module.exports = {getMessages}