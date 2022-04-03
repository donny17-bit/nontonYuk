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

  getBookingSeat: async (request, response) => {
    try {
      let { scheduleId, dateBooking, timeBooking } = request.query;

      if (!scheduleId) {
        scheduleId = 1;
      }

      if (!dateBooking) {
        dateBooking = "09:00";
      }

      if (!timeBooking) {
        timeBooking = "2022-01-01";
      }

      const setData = {
        scheduleId,
        dateBooking,
        timeBooking,
      };

      // di bikin perfect lg bisa klo ada time
      const result = await bookingModel.getBookingSeat(setData);

      result.map((value, index) => {
        result[index] = value.seat;
      });

      return helperWrapper.response(
        response,
        200,
        `sukses get booking seat`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  getBookingDashboard: async (request, response) => {
    try {
      let { scheduleId, movieId, location } = request.query;

      if (!scheduleId) {
        scheduleId = 1;
      }

      if (!movieId) {
        movieId = 1;
      }

      if (!location) {
        location = "yogyakarta";
      }

      const setData = {
        scheduleId,
        movieId,
        location,
      };

      const result = await bookingModel.getBookingDashboard(setData);

      return helperWrapper.response(
        response,
        200,
        `sukses get booking dashboard`,
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

      return helperWrapper.response(response, 200, `sukses create booking`, {
        ...result,
        seat,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
