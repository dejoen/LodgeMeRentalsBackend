const express = require("express");
const DatabaseConfig = require("./config/MongooseDbConfig");
 const dotenv = require('dotenv').config()
 const cors = require('cors')
 const bodyParser = require('body-parser')

 const app = express()

 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json());
app.use(cors())

const registerUserRoute = require('./features/userRegistration/route/UserRegistrationRoute')



app.use('/api/v1/user',registerUserRoute)
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

   DatabaseConfig().then((err)=>{
    
       app.listen(3040, () => {
           console.log(`Server started on port 3040`);
        });
}).catch(err=>{
    console.log('error occured'+err)
})
 
 
 