 const mongoose = require('mongoose')

 const NotificationSchema =  new mongoose.Schema({
   userId:{
        type:mongoose.SchemaTypes.String
    },
    notificationTitle:{
        type:mongoose.SchemaTypes.String
    },
    notificationBody:{
        type:mongoose.SchemaTypes.String
    },
    notificationTime:{
        type:mongoose.SchemaTypes.Date,
        dafault:Date.now()
    },
    notificationType:{
        type:mongoose.SchemaTypes.String
    },
    sender:{
        type:mongoose.SchemaTypes.ObjectId
    }
    
 })

  module.exports = mongoose.model('notification',NotificationSchema)