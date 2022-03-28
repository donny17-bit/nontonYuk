const mySql = require("mysql2");
const env = require("dotenv").config();

const connection = mySql.createConnection({
  host: env.parsed.host,
  user: env.parsed.user,
  password: env.parsed.password,
  database: env.parsed.database,
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("you are now connect to DB mysql");
});

module.exports = connection;
