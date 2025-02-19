 const tokenValidator = require('jsonwebtoken')

 const UsersModel = require('../../features/userRegistration/model/UsersModel')

 const UserPublishedHouses = require('../../features/agent/publishHouse/model/publishHouseModel')
const messageSocket = require('./messaging/controller/messageSocket')

module.exports = async (chatSocket) =>{
  
     chatSocket.use(async(socket,next)=>{
         
        let token = socket.handshake.auth.token || socket.handshake.headers.token

        if(!token){
            next(new Error(JSON.stringify({
                title:'LodgeMe Socket Message',
                message:'Unathourize access. Token is needed to access this feature'
            })))

            return
        }
        
        tokenValidator.verify(token,process.env.SECRET_KEY,async (err,decoded)=>{
              if(err){
                next(new Error(JSON.stringify({
                    title:'LodgeMe Socket Message',
                    message:'An error occured.',
                    error:err.message
                })))
                return
              }

              const isUserRegistered = await UsersModel.findOne({userEmail:decoded.userEmail})

              if(!isUserRegistered){
                next(new Error(JSON.stringify({
                    title:'LodgeMe Socket Message',
                    message:'User not registered. Please register',
                   
                })))
                return
              }

              socket.user = decoded
              next()
        })
     }).on('connection',async(socket)=>{
          
      

         const user = await UsersModel.findOne({_id:socket.user._id})
          if(user){
            await user.updateOne({userSocketConnectionId:socket.id,isOnline:true})
          }
         

      const houses = await UserPublishedHouses.find({publisher:socket.user._id})

        if(socket.user.accountType === "agent"){
          const connectedUser = await UsersModel.findOne({_id:socket.user._id},{userSocketConnectionId:0})
          socket.emit('socketConnected',connectedUser)
          console.log('connected successfully.')

          console.log(`user socket ${user.userSocketConnectionId}`)
        }else{
          const connectedUser = await UsersModel.findOne({_id:socket.user._id},{userSocketConnectionId:0,isAgentFileAlreadyUploaded:0,isAgentVerified:0, 'userProfile.publishingAs':0})
          socket.emit('socketConnected',connectedUser)
          console.log('connected successfully.')

          console.log(`user socket ${user.userSocketConnectionId}`)
        }

        
         // console.log(await UsersModel.find())


          messageSocket(chatSocket,socket)

          socket.on('fetch-published-house',d=>{
            console.log(d)
            
             socket.emit('published-houses',JSON.stringify(houses))
          })

          socket.on('user',()=>{
            socket.emit('userData',connectedUser)
          })
          
      socket.on('hello', d=>console.log(d))
          
          socket.on('disconnect',async ()=>{
         const  user= await UsersModel.findOne({_id:socket.user._id})
            await user.updateOne({isOnline:false})
            console.log('disconnected')
          const disconnectedUser = await UsersModel.findOne({_id:socket.user._id})
          console.log(disconnectedUser)
            socket.emit('disconnected',disconnectedUser)
         })
     })
    
     
     
     

}