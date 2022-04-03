const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

// lengkapi authentikasi
Router.get("/", bookingController.getAllBooking);
Router.get("/user/:userId", bookingController.getBookingByUserId);
Router.get("/seat", bookingController.getBookingSeat);
Router.get("/dashboard", bookingController.getBookingDashboard);
Router.get("/id/:id", bookingController.getBookingById);
Router.post("/", bookingController.createBooking);
// Router.patch("/:id", scheduleController.updateSchedule);
// Router.delete("/:id", scheduleController.deleteSchedule);

module.exports = Router;
