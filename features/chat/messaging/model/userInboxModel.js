const mongoose = require("mongoose");

const userInboxSchema =  new mongoose.Schema({
    
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        unique:[true,"inbox owner should be unique."]
    },
    userInboxData:[
        {
            sender:{
                type:mongoose.Schema.Types.ObjectId,
                unique:[true,'sender should be unique']
            },

            messages:[
             {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Messages"
             },

     
            ],

            notificationOfUnreadMessages :{
                type:mongoose.Schema.Types.Number
             }
        }
    ]
})

module.exports =  mongoose.model("UserIbox",userInboxSchema)