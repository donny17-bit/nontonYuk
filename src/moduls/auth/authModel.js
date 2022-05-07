const connection = require("../../config/mySql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO user SET ?",
        data,
        (error, result) => {
          console.log(result);
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            delete newResult.password;
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query);
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email = ?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE id = ?",
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
  activate: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET status = 'active' WHERE id = ?",
        id,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
              status: "active",
            };
            delete newResult.password;
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};
