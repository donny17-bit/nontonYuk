const helperWrapper = require("../../helpers/wrapper");
const bookingModel = require("./bookingModel");

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
      const { id } = request.params;

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

  getBookingByUserId: async (request, response) => {
    try {
      const { userId } = request.params;

      const result = await bookingModel.getBookingByUserId(userId);
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
      const {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;

      const setDataBooking = {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket: seat.length,
        totalPayment,
        paymentMethod,
      };

      const result = await bookingModel.createBooking(setDataBooking);

      const bookingId = result.id;

      seat.map(async (value) => {
        const setDataSeat = { bookingId, seat: value };
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
