const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.get("/", bookingController.getAllBooking);
// Router.get("/:id", scheduleController.getScheduleById);
Router.post("/", bookingController.createBooking);
// Router.patch("/:id", scheduleController.updateSchedule);
// Router.delete("/:id", scheduleController.deleteSchedule);

module.exports = Router;
