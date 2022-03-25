const helperWrapper = require("../../helpers/wrapper");
const movieModel = require("./movieModel");

module.exports = {
  // getHello: async (request, response) => {
  //   try {
  //     // response.status(200);
  //     // response.send("hello world");
  //     return helperWrapper.response(
  //       response,
  //       200,
  //       "sukses get data",
  //       "hello world"
  //     );
  //   } catch (error) {
  //     return helperWrapper.response(response, 400, "bad request", null);
  //   }
  // },

  getAllMovie: async (request, response) => {
    // buat fitu pencarian berdasarkan nama
    // buat fitur pengurutan berdasarkan nama
    try {
      const { sort, searchName } = request.query;
      let { page, limit } = request.query;

      page = Number(page);
      limit = Number(limit);
      // 1. offset
      const offset = page * limit - limit;
      // 2. total data
      const totalData = await movieModel.getTotalMovies();
      // 3. total page
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      const result = await movieModel.getAllMovies(
        searchName,
        sort,
        limit,
        offset
      );

      return helperWrapper.response(
        response,
        200,
        "sukses get data",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  getMovieById: async (request, response) => {
    try {
      // console.log(request.params);

      const { id } = request.params;
      const result = await movieModel.getMovieById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        "sukses get data by id",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  createMovies: async (request, response) => {
    try {
      const { name, category, synopsis } = request.body;
      const setData = {
        name,
        category,
        synopsis,
      };

      const result = await movieModel.createMovies(setData);
      return helperWrapper.response(response, 200, "sukses post data", result);
    } catch (error) {
      // console.log(error);
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  updateMovies: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await movieModel.getMovieById(id);

      if (cekId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const { name, category, synopsis } = request.body;
      const setData = {
        name,
        category,
        synopsis,
        updatedAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // if (!setData[data] === undefined) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await movieModel.updateMovies(id, setData);

      return helperWrapper.response(
        response,
        200,
        "sukses update data",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  deleteMovies: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await movieModel.getMovieById(id);

      if (cekId.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      const result = await movieModel.deleteMovies(id);

      return helperWrapper.response(
        response,
        200,
        "sukses delete data",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
