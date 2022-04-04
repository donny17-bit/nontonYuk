const redis = require("../config/redis");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  getMovieRedis: async (request, response, next) => {
    try {
      const data = await redis.get(`getMovie:${JSON.stringify(request.query)}`);
      if (data !== null) {
        const { result, pageInfo } = JSON.parse(data);
        return helperWrapper.response(
          response,
          200,
          "Success get data !",
          result,
          pageInfo
        );
      }
      return next();
    } catch (error) {
      return helperWrapper.response(response, 400, error.message, null);
    }
  },

  getMovieByIdRedis: async (request, response, next) => {
    try {
      const { id } = request.params;
      let result = await redis.get(`getMovie:${id}`);
      result = JSON.parse(result);
      console.log(result);

      if (result !== null) {
        console.log("data ada di dalam redis");
        result = JSON.parse(result);
        return helperWrapper.response(
          response,
          200,
          "Success get data !",
          result
        );
      }
      console.log("data tidak ada di dalam redis");
      return next();
    } catch (error) {
      return helperWrapper.response(response, 400, error.message, null);
    }
  },

  clearMovieRedis: async (request, response, next) => {
    try {
      const keys = await redis.keys("getMovie:*");

      if (keys.length > 0) {
        keys.forEach(async (element) => {
          console.log(element);
          await redis.del(element);
        });
      }
      console.log(keys);
      return next();
    } catch (error) {
      return helperWrapper.response(response, 400, error.message, null);
    }
  },
};
