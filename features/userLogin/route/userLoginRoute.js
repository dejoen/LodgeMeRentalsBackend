const authHandlerMiddleWare = require('../../../middleware/authHandlerMiddleWare')
const { LoginUser, uploadAgentFileForVerification } = require('../controller/userLoginController')



const route = require('express').Router()

route.post('/loginUser',LoginUser)
route.post('/verify-agent-documment',authHandlerMiddleWare,uploadAgentFileForVerification)


 module.exports = route