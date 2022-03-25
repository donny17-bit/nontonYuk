const mySql = require("mysql2");

const connection = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nontonYuk",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("you are now connect to DB mysql");
});

module.exports = connection;
