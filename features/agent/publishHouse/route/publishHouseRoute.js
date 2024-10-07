const authHandlerMiddleWare = require('../../../../middleware/authHandlerMiddleWare')
const { publishHouse } = require('../controller/publishHouseController')

const   route = require('express').Router()


 route.post('/publish-house',authHandlerMiddleWare,publishHouse)


 module.exports = route