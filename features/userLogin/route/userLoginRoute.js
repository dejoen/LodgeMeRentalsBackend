const { LoginUser } = require('../controller/userLoginController')

const route = require('express').Router()

route.post('/loginUser',LoginUser)

 module.exports = route