const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

// Router.get("/", bookingController.getAllBooking);
Router.get(
  "/user/:userId",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);
Router.get(
  "/seat",
  middlewareAuth.authentication,
  bookingController.getBookingSeat
);
Router.get(
  "/dashboard",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.getBookingDashboard
);
Router.get(
  "/id/:id",
  middlewareAuth.authentication,
  bookingController.getBookingById
);
Router.post(
  "/",
  middlewareAuth.authentication,
  bookingController.createBooking
);
Router.patch(
  "/ticket/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  bookingController.updateStatusBooking
);

// blm dikasih autentikasi
Router.post(
  "/midtrans-notification",
  bookingController.postMidtransNotification
);

module.exports = Router;
