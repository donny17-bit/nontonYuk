const connection = require("../../config/mySql");

module.exports = {
  getTotalMovies: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM movies",
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getAllMovies: (searchName, sort, limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM movies WHERE name LIKE '%${searchName}%' ORDER BY ${sort} LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getMovieById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movies where id = ?",
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

  createMovies: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO movies SET ?",
        data,
        (error, result) => {
          if (!error) {
            console.log(result);
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),

  updateMovies: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE movies SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  deleteMovies: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM movies WHERE id = ?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
};
