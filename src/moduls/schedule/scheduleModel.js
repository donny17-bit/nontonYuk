const connection = require("../../config/mySql");

module.exports = {
  getTotalSchedule: (searchLocation, searchMovieId) =>
    new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS total FROM schedule AS s 
      JOIN movies AS m on m.id = s.movieId
      WHERE location LIKE '%${searchLocation}%'
      ${searchMovieId ? `AND movieId = ${searchMovieId}` : ``}`;
      connection.query(query, (error, result) => {
        if (!error) {
          resolve(result[0].total);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  getAllSchedule: (searchLocation, searchMovieId, sort, limit, offset) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `SELECT s.id, s.movieId, s.premiere, s.price, s.location, s.dateStart, s.dateEnd, s.time, 
      m.name, m.category, m.image, m.releaseDate, m.cast, m.director, m.synopsis, m.duration FROM schedule AS s 
      JOIN movies AS m on m.id = s.movieId
      WHERE s.location LIKE '%${searchLocation}%'
      ${
        searchMovieId
          ? `AND s.movieId = ${searchMovieId} ORDER BY '${sort}'
    LIMIT ? OFFSET ?`
          : `ORDER BY '${sort}'
    LIMIT ? OFFSET ?`
      }`,
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query);
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
            const newResult = {
              id: result.id,
              ...data,
            };
            resolve(newResult);
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
            const newResult = {
              id: result.id,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};
