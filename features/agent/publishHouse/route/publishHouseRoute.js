const authHandlerMiddleWare = require('../../../../middleware/authHandlerMiddleWare')
const { publishHouse, getAllPublishedHouses } = require('../controller/publishHouseController')

const   route = require('express').Router()


 route.post('/publish-house',authHandlerMiddleWare,publishHouse)

 route.get('/all-houses',authHandlerMiddleWare,getAllPublishedHouses)

 module.exports = route