const helperWrapper = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");
// const bookingModel = require("./bookingModel");

module.exports = {
  getAllBooking: async (request, response) => {
    try {
      const result = await bookingModel.getAllBooking();
      return helperWrapper.response(
        response,
        200,
        `sukses get booking`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  getBookingById: async (request, response) => {
    try {
      const id = request.params;

      const result = await bookingModel.getBookingById(id);
      return helperWrapper.response(
        response,
        200,
        `sukses get booking by id`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  createBooking: async (request, response) => {
    try {
      //   console.log(request.body);
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;

      //   const seatRequest = seat;
      const setDataBooking = {
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket: seat.length,
        totalPayment,
        paymentMethod,
      };

      const result = await bookingModel.createBooking(setDataBooking);

      const bookingId = result.id;

      seat.map(async (seat) => {
        const setDataSeat = { bookingId, seat };
        await bookingModel.createBookingSeat(setDataSeat);
      });

      return helperWrapper.response(
        response,
        200,
        `sukses create booking`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
