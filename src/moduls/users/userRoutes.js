const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadUser");
// const middlewareRedis = require("../../middleware/redis");

Router.get("/:id", middlewareAuth.authentication, userController.getUserById);
Router.patch(
  "/profile/:id",
  middlewareAuth.authentication,
  userController.updateUserProfile
);
Router.patch(
  "/password/:id",
  middlewareAuth.authentication,
  userController.updateUserPassword
);
Router.patch(
  "/image/:id",
  middlewareAuth.authentication,
  middlewareUpload,
  userController.updateUserImage
);

module.exports = Router;
