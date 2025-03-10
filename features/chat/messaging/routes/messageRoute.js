const route = require("express").Router()
const authValidator = require('../../../../middleware/authHandlerMiddleWare')
const { getMessages, getUserNotifications } = require("../controller/messageController")

route.post("/messages",authValidator,getMessages)

route.get('/notifications',authValidator,getUserNotifications)


module.exports = route