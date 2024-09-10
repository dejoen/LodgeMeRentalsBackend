
const LoginUserModel = require('../model/userLoginModel')
const UsersModel =  require('../../userRegistration/model/UsersModel')

const verifyPassword = require('bcryptjs')
const tokenSigner = require('jsonwebtoken')


const LoginUser = async (req,res) => {
    const {userEmail,userPassword} = req.body

    if(!userEmail || !userPassword){
        res.status(403).json({
            title:"LodgeMe Login Message",
            status:403,
            successfull:false,
            message:"UserEmail and userPassword field is required to continue."
        })
        return
    }

    try {
        const user = await   UsersModel.findOne({userEmail},{userSocketConnectionId:0})
        if(!user){
            res.status(403).json({
                title:"LodgeMe Login Message",
                status:403,
                successfull:false,
                message:"UserEmail is not registered with us. Please check and try again."
            }) 
            return
        }
         const isPasswordValid = await verifyPassword.compare(userPassword,user.userPassword)
         if(!isPasswordValid){
            res.status(403).json({
                title:"LodgeMe Login Message",
                status:403,
                successfull:false,
                message:"Password provided is not valid. Please provide a valid password."
            }) 
            return
         }
         const token = await tokenSigner.sign(user._doc,process.env.SECRET_KEY,{expiresIn:'30d'})
         res.status(200).json({
            title:"LodgeMe Login Message",
            status:200,
            successfull:true,
            message:"Successfully Logged in to LodgeMe. Welcome back.",
            user:{
                ...user._doc,
                token
            }
        }) 

    } catch (error) {

        res.status(500).json({
            title:"LodgeMe Login Message",
            status:500,
            successfull:false,
            message:"An error occurred.",
            error:error.message
        }) 
        
    }


}


module.exports = {LoginUser}