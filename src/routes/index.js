const express = require("express");

const Router = express.Router();

const movieRoutes = require("../moduls/movie/movieRoutes");
const scheduleRoutes = require("../moduls/schedule/scheduleRoutes");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);

// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
