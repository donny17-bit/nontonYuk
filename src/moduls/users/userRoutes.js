const express = require("express");

const Router = express.Router();

const userController = require("./userController");
// const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadUser");
// const middlewareRedis = require("../../middleware/redis");

Router.get("/:id", userController.getUserById);
Router.patch("/profile/:id", userController.updateUserProfile);
Router.patch("/password/:id", userController.updateUserPassword);
Router.patch("/image/:id", middlewareUpload, userController.updateUserImage);

module.exports = Router;
