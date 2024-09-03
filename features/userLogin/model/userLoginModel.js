 const mongoose = require('mongoose')

 const LoginUserSchema = new mongoose.Schema({
    userEmail:{
        type:String,
        required: true,
       unique: true,
       match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
       
      },
      userPassword:{
        type:String
      },
 })

 module.exports = mongoose.model('LoginUser',LoginUserSchema)