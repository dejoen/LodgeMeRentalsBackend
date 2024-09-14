const authHandlerMiddleWare = require('../../../middleware/authHandlerMiddleWare')
const { LoginUser, uploadAgentFileForVerification, verifyUserByToken } = require('../controller/userLoginController')



const route = require('express').Router()

route.post('/loginUser',LoginUser)
route.post('/verify-agent-documment',authHandlerMiddleWare,uploadAgentFileForVerification)
route.get('/verify-token',authHandlerMiddleWare,verifyUserByToken)

 module.exports = route