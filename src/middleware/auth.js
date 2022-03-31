const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  authentication: (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "Please login first", null);
    }

    token = token.split(" ")[1];

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message, null);
      }
      console.log(result);

      request.decodeToken = result;
      return next();
    });
  },

  isAdmin: (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
      return helperWrapper.response(response, 403, "Please login first", null);
    }

    token = token.split(" ")[1];

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message, null);
      }
      console.log(result);

      request.decodeToken = result;
      return next();
    });
  },
  //   isAdmin
  //   bisa pake decodeToken
  //   apakah user yg login adalah admin
  //   jika iya, maka lanjut ke controller, jika tidak kasih pesan error
};
