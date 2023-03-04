const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const helperMidtrans = require("../../helpers/midtrans");
const bookingModel = require("./bookingModel");

module.exports = {
  // getAllBooking: async (request, response) => {
  //   try {
  //     const result = await bookingModel.getAllBooking();
  //     return helperWrapper.response(
  //       response,
  //       200,
  //       `sukses get booking`,
  //       result
  //     );
  //   } catch (error) {
  //     return helperWrapper.response(response, 400, "bad request", null);
  //   }
  // },

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

      // uuid dari sini
      const bookingId = result.id;

      seat.map(async (value) => {
        const setDataSeat = { bookingId, seat: value };
        await bookingModel.createBookingSeat(setDataSeat);
      });

      const setDataMidtrans = {
        id: uuidv4(),
        total: totalPayment,
      };

      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);
      return helperWrapper.response(response, 200, `sukses create booking`, {
        id: result.id,
        ...request.body,
        redirectUrl: resultMidtrans.redirect_url,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, error.message, null);
    }
  },

  postMidtransNotification: async (request, response) => {
    try {
      console.log(request.body);
      const result = await helperMidtrans.notif(request.body);
      const orderId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      // Sample transactionStatus handling logic

      if (transactionStatus == "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          // UBAH STATUS PEMBAYARAN MENJADI PENDING
          // PROSES MEMANGGIL MODEL untuk mengubah data di dalam database
          // id = orderId;
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "PENDING",
            // updatedAt: ...
          };
          await bookingModel.updateBooking(orderId, setData);
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your databaase to 'success'
          // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
          // id = orderId;
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "SUCCESS",
            // updatedAt: ...
          };
          await bookingModel.updateBooking(orderId, setData);
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
        // id = orderId;
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "SUCCESS",
          // updatedAt: ...
        };
        await bookingModel.updateBooking(orderId, setData);
        console.log(
          `Sukses melakukan pembayaran dengan id ${orderId} dan data yang diubah ${JSON.stringify(
            setData
          )}`
        );
      } else if (transactionStatus == "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "FAILED",
          // updatedAt: ...
        };
        await bookingModel.updateBooking(orderId, setData);
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // UBAH STATUS PEMBAYARAN MENJADI FAILED
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "FAILED",
          // updatedAt: ...
        };
        await bookingModel.updateBooking(orderId, setData);
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        // UBAH STATUS PEMBAYARAN MENJADI PENDING
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "PENDING",
          // updatedAt: ...
        };
        await bookingModel.updateBooking(orderId, setData);
      }
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;

      // cek statusUsed is still active or not
      const cekStatus = await bookingModel.getBookingById(id);
      if (cekStatus[0].statusUsed === "notActive") {
        return helperWrapper.response(
          response,
          400,
          "sorry, ticket have been used",
          null
        );
      }

      const result = await bookingModel.updateStatusBooking(id);

      return helperWrapper.response(response, 200, "sukses use ticket", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
