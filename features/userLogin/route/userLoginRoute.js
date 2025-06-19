const authHandlerMiddleWare = require("../../../middleware/authHandlerMiddleWare");
const {
  LoginUser,
  uploadAgentFileForVerification,
  verifyUserByToken,
  updateAgentProfile,
  updateCLientProfile,
} = require("../controller/userLoginController");

const route = require("express").Router();

route.post("/loginUser", LoginUser);
route.post(
  "/verify-agent-documment",
  authHandlerMiddleWare,
  uploadAgentFileForVerification,
);
route.get("/verify-token", authHandlerMiddleWare, verifyUserByToken);

route.post("/update-agent-profile", authHandlerMiddleWare, updateAgentProfile);
route.post(
  "/update-client-profile",
  authHandlerMiddleWare,
  updateCLientProfile,
);

module.exports = route;
