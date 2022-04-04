const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadMovie");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getMovieRedis,
  movieController.getAllMovie
);
Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);

Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareUpload,
  movieController.createMovies
);

Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareUpload,
  middlewareRedis.clearMovieRedis,
  movieController.updateMovies
);

Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  movieController.deleteMovies
);

module.exports = Router;
