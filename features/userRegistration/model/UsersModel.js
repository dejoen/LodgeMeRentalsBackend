  
  const { default: mongoose } = require('mongoose')
const moongoose = require('mongoose')

  const UsersSchema = new moongoose.Schema({
      
      accountType:{
        type:String,
      
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
      },

      userProfile:{
        firstName:{
          type:String,
          default:''
        },
        lastName:{
          type:String,
          default:''
        },
        profileImage:{
          type:String,
          default:''
        },
        coverImage:{
          type:String,
          default:''
        },
        country:{
          type:String,
          default:''
        },
        state:{
          type:String,
          default:''
        },
        localGovt:{
          type:String,
          default:''
        },
        gender:{
          type:String,
          default:''
        },
        postalCode:{
          type:String,
          default:''
        },
        language:{
          type:String,
          default:''
        },
        about:{
          type:String,
          default:''
        },
       
        publishingAs:{
          type:String,
          default:''
        },

        dob:{
          type:String,
          default:''
        },

       

      }
  })

  module.exports = mongoose.model('Users',UsersSchema)