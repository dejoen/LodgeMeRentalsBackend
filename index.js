const express = require("express");
const DatabaseConfig = require("./config/MongooseDbConfig");
 const dotenv = require('dotenv').config()
 const cors = require('cors')
 const bodyParser = require('body-parser')

 const app = express()

const server = require("http").Server(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const chatSocket = io.of("/chat");

require('./features/chat/socketInitialization')(chatSocket)



 app.use(bodyParser.urlencoded({ extended: false ,limit:'50mb'}))
 app.use(bodyParser.json({limit:'50mb'}));
app.use(cors())

const registerUserRouter = require('./features/userRegistration/route/UserRegistrationRoute')
 const loginUserRouter = require('./features/userLogin/route/userLoginRoute');
const UsersModel = require("./features/userRegistration/model/UsersModel");
const publishHouseRouter = require('./features/agent/publishHouse/route/publishHouseRoute')
const  messagesRouter = require("./features/chat/messaging/routes/messageRoute")

app.use('/api/v1/user',registerUserRouter)
app.use('/api/v1/user',loginUserRouter)
app.use('/api/v1/user',publishHouseRouter)
app.use("/api/v1/user/message",messagesRouter)


 app.get('/',(req,res)=>{
     res.status(200).json({
        message:"hello message"
     })
 })
   
 app.post('/',(req,res)=>{
    console.log(req.body)
    res.status(200).json({
        message:"hello recieved"
     })
 })

   DatabaseConfig().then( async(err)=>{
   //await UsersModel.deleteMany()@    
       server.listen(3040, () => {
           console.log(`Server started on port 3040`);
        });
}).catch(err=>{
    console.log('error occured'+err)
})
 
 
 