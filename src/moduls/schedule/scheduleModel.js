const connection = require("../../config/mySql");

module.exports = {
  getTotalSchedule: () =>
    // masih salah bisa tanya arin atau teguh (lupa soale :v)
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM schedule",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getAllSchedule: (searchLocation, searchMovieId, sort, limit, offset) =>
    new Promise((resolve, reject) => {
      const query = `SELECT * FROM schedule AS s 
      JOIN movies AS m on m.id = s.movieId
      WHERE location LIKE '%${searchLocation}%'
      ${
        searchMovieId
          ? `AND movieId = ${searchMovieId} ORDER BY '${sort}'
      LIMIT ? OFFSET ?`
          : `ORDER BY '${sort}'
      LIMIT ? OFFSET ?`
      }`;

      connection.query(query, [limit, offset], (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM schedule WHERE id = ?",
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

  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (error, result) => {
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

  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
        [data, id],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM schedule WHERE id = ?",
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
};
