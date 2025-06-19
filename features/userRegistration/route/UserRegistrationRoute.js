const { registerUser } = require("../controller/userRegistrationController");

const route = require("express").Router();

route.post("/register", registerUser);

module.exports = route;
