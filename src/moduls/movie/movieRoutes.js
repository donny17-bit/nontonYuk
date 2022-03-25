const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");

// Router.get("/hello", movieController.getHello);
Router.get("/", movieController.getAllMovie);
Router.get("/:id", movieController.getMovieById);
Router.post("/", movieController.createMovies);
Router.patch("/:id", movieController.updateMovies);
Router.delete("/:id", movieController.deleteMovies);

// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
