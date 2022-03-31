const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadMovie");
const middlewareRedis = require("../../middleware/redis");

Router.get("/", middlewareAuth.authentication, movieController.getAllMovie);
Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
Router.post("/", middlewareUpload, movieController.createMovies); // authentication, isAdmin
Router.patch(
  "/:id",
  middlewareRedis.clearMovieRedis,
  movieController.updateMovies
); // authentication, isAdmin
Router.delete("/:id", movieController.deleteMovies); // authentication, isAdmin

module.exports = Router;
