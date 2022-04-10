const mySql = require("mysql2");

const connection = mySql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("you are now connect to DB mysql");
});

module.exports = connection;
