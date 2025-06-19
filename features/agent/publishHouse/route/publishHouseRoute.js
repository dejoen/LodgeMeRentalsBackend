const authHandlerMiddleWare = require("../../../../middleware/authHandlerMiddleWare");
const {
  publishHouse,
  getAllPublishedHouses,
  getHousesPublishedByAgent,
} = require("../controller/publishHouseController");

const route = require("express").Router();

route.post("/publish-house", authHandlerMiddleWare, publishHouse);

route.get("/all-houses", authHandlerMiddleWare, getAllPublishedHouses);
route.post(
  "/my-houses-publised",
  authHandlerMiddleWare,
  getHousesPublishedByAgent,
);
module.exports = route;
