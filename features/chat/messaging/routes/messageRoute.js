const route = require("express").Router();
const authValidator = require("../../../../middleware/authHandlerMiddleWare");
const { getMessages } = require("../controller/messageController");

route.get("/messages", authValidator, getMessages);

module.exports = route;
