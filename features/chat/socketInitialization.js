 const tokenValidator = require('jsonwebtoken')

 const UsersModel = require('../../features/userRegistration/model/UsersModel')

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
          const connectedUser = await UsersModel.findOne({_id:socket.user._id})
          socket.emit('socketConnected',connectedUser)
          console.log('connected successfully.')
          console.log("users:")
          console.log(await UsersModel.find())
      socket.on('hello', d=>console.log(d))
          console.log( connectedUser)
          socket.on('disconnect',async ()=>{
            await user.updateOne({isOnline:false})
            console.log('disconnected')
            console.log( await UsersModel.findOne({_id:socket.user._id}))
         })
     })
    
     
     
     

}