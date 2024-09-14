  
  const { default: mongoose } = require('mongoose')
const moongoose = require('mongoose')

  const UsersSchema = new moongoose.Schema({
      
      accountType:{
        type:String,
        unique:true,
        required:[true,'you need to fill the account type details']
      },
      userName:{
        type:String,
      },
      userEmail:{
        type:String,
        required: true,
       unique: true,
       match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
       
      },
      userPhoneNumber:{
        type:String
      },
      userPassword:{
        type:String
      },
      isOnline:{
        type:Boolean,
        default:false
      },
      userSocketConnectionId:{
        type:String,
        default:''
      },
      timeCreated:{
        type:Date,
        default:null
      },
      isAgentVerified:{
        type:Boolean,
        default:false
      },
      isAgentFileAlreadyUploaded:{
        type:Boolean,
        default:false
      }
  })

  module.exports = mongoose.model('Users',UsersSchema)