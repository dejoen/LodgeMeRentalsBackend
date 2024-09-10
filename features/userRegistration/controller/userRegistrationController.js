
  const UsersModel = require('../model/UsersModel')
 const passwordHasher = require('bcryptjs')
 const jsonWebToken = require('jsonwebtoken')

  const  registerUser = async (req,res) =>{
    const {accountType, userName, userEmail,userPhoneNumber,userPassword} = req.body

      if(!accountType || !userName || !userEmail || !userPhoneNumber || !userPassword){
          res.status(403).json({
            title:'LodgeMe Registration Message',
            status:403,
            successfull:false,
            message:"accountType,userName,userEmail,userPhoneNumber and userPassword fields are required to continue."
          })

          return
      }

      const isUserAlreadyRegistered = await UsersModel.findOne({userEmail})
    
      if(isUserAlreadyRegistered){
        res.status(403).json({
          title:'LodgeMe Registration Message',
          status:403,
          successfull:false,
          message:`An account is already created with email= ${userEmail}  please change email.`
        })
    return
      }
     try {

  const salt = await passwordHasher.genSalt(10)
  const hashedPassword = await passwordHasher.hash(userPassword,salt)

  const user = new UsersModel({
    accountType,userName,userEmail,userPhoneNumber,userPassword:hashedPassword,timeCreated:Date.now()
  })

  await user.save()

const token = await jsonWebToken.sign(
user._doc
 ,process.env.SECRET_KEY,{expiresIn:'30d'})


  res.status(200).json({
    title:'LodgeMe Registration Message',
    status:200,
    successfull:true,
    message:"Account successfully created.",
    user:{
    
      ...user._doc,
      token
     

    }
  })
  
} catch (error) {
  res.status(500).json({
    title:'LodgeMe Registration Message',
    status:500,
    successfull:false,
    message:"An error occured ",
    error:error.message
  }) 
}
    
      


  }


  module.exports = {registerUser}