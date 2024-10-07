
const LoginUserModel = require('../model/userLoginModel')
const UsersModel =  require('../../userRegistration/model/UsersModel')

const verifyPassword = require('bcryptjs')
const tokenSigner = require('jsonwebtoken')
const UploadFile = require('../../../utils/UploadFile')


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
        const user = await   UsersModel.findOne({userEmail})
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
         await user.updateOne({isOnline:true})
         const token =  tokenSigner.sign(user._doc,process.env.SECRET_KEY,{expiresIn:'30d'})
         
         if(user.accountType ==="agent"){
            const {...newData} = user._doc

               res.status(200).json({
               title:"LodgeMe Login Message",
               status:200,
               successfull:true,
               message:"Successfully Logged in to LodgeMe. Welcome back.",
               user:{
                   ...newData,
                   token
               }
           }) 
           return
         }

           const {isAgentFileAlreadyUploaded,isAgentVerified,userSocketConnectionId,...newData} = user._doc

               res.status(200).json({
               title:"LodgeMe Login Message",
               status:200,
               successfull:true,
               message:"Successfully Logged in to LodgeMe. Welcome back.",
               user:{
                   ...newData,
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

const uploadAgentFileForVerification = async (req,res,next) =>{
    const  {verificationDocument}  = req.body
  const user = await UsersModel.findOne({_id:req.user._id})
   console.log(verificationDocument)
     if(user.isAgentFileAlreadyUploaded){
        res.status(403).json({
            title:"Agent Verification Message",
            status:403,
            successfull:false,
            message:'File already uploaded please wait while we review your document'
 
          })
 
          return 
     }
    if(!verificationDocument){
         res.status(403).json({
           title:"Agent Verification Message",
           status:403,
           successfull:false,
           message:'verificationDocument field is required to continue.'

         })

         return
    }

    if(verificationDocument.length<2){
       res.status(403).json({
         title:"Agent Verification Message",
         status:403,
         successfull:false,
         message:'Two document is needed to be submitted check and try again.'

       })

       return
  }

     if(!verificationDocument.every((document)=>{
       return document.base64 != null
    })){
       res.status(403).json({
           title:"Agent Verification Message",
           status:403,
           successfull:false,
           message:'You need base64 field to continue.'

         })

         return
    }

    if(!verificationDocument.every((document)=>{
       var regexBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
       return  regexBase64.test(document.base64)
    })){
       res.status(403).json({
           title:"Agent Verification Message",
           status:403,
           successfull:false,
           message:'Invalid base64 provided please check and try again.'

         })

         return
    }

    try {
       const folderPath = req.user._id
       const  documentOne = await UploadFile(verificationDocument[0],folderPath)
        const documentTwo = await UploadFile(verificationDocument[1],folderPath)
   
         Promise.all([documentOne,documentTwo]).then(async(result) => {
             console.log(result)
              await user.updateOne({isAgentFileAlreadyUploaded:true})
             
             res.status(200).json({
               title:"Agent Verification Message",
               status:200,
               successfull:true,
               message:'Successfully uploaded image.',
               user
   
             })
         }).catch((err) => {
           
           res.status(500).json({
               title:"Agent Verification Message",
               status:500,
               successfull:false,
               message:'error occured.',
               error:err.message
   
             })
         });
       
    } catch (error) {
       next(error)
    }
    
     

    
}

const verifyUserByToken = async (req,res)=>{
     const user = await UsersModel.findOne({_id:req.user._id})
     console.log('verification')
     console.log(user)
     res.status(200).json({
        title:"User Detail Meessage",
        status:200,
        successfull:true,
        user
     })
}


module.exports = {LoginUser,uploadAgentFileForVerification,verifyUserByToken}