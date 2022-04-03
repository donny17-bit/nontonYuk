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

      request.decodeToken = result;
      return next();
    });
  },

  isAdmin: (request, response, next) => {
    // let token = request.headers.authorization;
    // if (!token) {
    //   return helperWrapper.response(response, 403, "Please login first", null);
    // }

    const { role } = request.decodeToken;
    // cek role user
    if (role !== "admin") {
      return helperWrapper.response(
        response,
        400,
        "Sorry, only admin can create movie data",
        null
      );
    }

    return next();

    // token = token.split(" ")[1];

    // jwt.verify(token, "RAHASIA", (error, result) => {
    //   if (error) {
    //     return helperWrapper.response(response, 403, error.message, null);
    //   }

    //   request.decodeToken = result;
    //   return next();
    // });
  },
};
