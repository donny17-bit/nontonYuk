const express = require("express");

const Router = express.Router();

const movieRoutes = require("../moduls/movie/movieRoutes");
const scheduleRoutes = require("../moduls/schedule/scheduleRoutes");
const bookingRoutes = require("../moduls/booking/bookingRoutes");
const authRoutes = require("../moduls/auth/authRoutes");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);
Router.use("/booking", bookingRoutes);
Router.use("/auth", authRoutes);

module.exports = Router;
