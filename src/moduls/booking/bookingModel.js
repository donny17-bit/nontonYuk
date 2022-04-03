const connection = require("../../config/mySql");

module.exports = {
  getAllBooking: () =>
    new Promise((resolve, reject) => {
      connection.query("SELECT * FROM booking", (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  createBookingSeat: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO bookingseat SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              // digunakan untuk hanya menyimpan/menampilkan data yang penting dari result
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  createBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO booking SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            // digunakan untuk hanya menyimpan/menampilkan data yang penting dari result
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getBookingByUserId: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM booking WHERE userId = ?",
        userId,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getBookingSeat: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT bs.seat FROM bookingseat AS bs 
        INNER JOIN booking AS b on bs.bookingId = b.id 
        WHERE b.scheduleId = ? 
        AND b.dateBooking = ? 
        AND b.timeBooking = ?`,
        [data.scheduleId, data.dateBooking, data.timeBooking],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getBookingDashboard: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTH(b.createdAt) AS month, SUM(b.totalPayment) AS total FROM booking AS b
        JOIN schedule AS s ON b.scheduleId = s.id WHERE b.scheduleId = ? 
        AND s.movieId = ? AND s.location = ? GROUP BY month`,
        [data.scheduleId, data.movieId, data.location],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};
