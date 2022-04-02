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
};
