const connection = require("../../config/mySql");

module.exports = {
  getTotalMovies: (searchName, searchRelease) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM movies WHERE name LIKE '%${searchName}%'
        ${searchRelease ? `AND MONTH(releaseDate) = ${searchRelease}` : ``}`,
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getAllMovies: (searchName, sort, limit, offset, searchRelease) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM movies WHERE name LIKE '%${searchName}%' 
        ${
          searchRelease
            ? `AND MONTH(releaseDate) = ${searchRelease} 
            ORDER BY '${sort}' LIMIT ? OFFSET ?`
            : `ORDER BY '${sort}' LIMIT ? OFFSET ?`
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
      connection.query("INSERT INTO movies SET ?", data, (error, result) => {
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
