const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const cloudinary = require("../../config/cloudinary");
const movieModel = require("./movieModel");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      // console.log(request.decodeToken);
      // let {} = request.query;
      let { page, limit, sort, searchName } = request.query;

      // cek page kosong atau tidack
      if (page) {
        page = Number(page);
      } else {
        page = 1;
      }

      // cek limit kosong atau tidack
      if (limit) {
        limit = Number(limit);
      } else {
        limit = 5;
      }

      if (!sort) {
        sort = "name";
      }

      if (searchName === undefined) {
        searchName = "";
      }
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

      // proses menyimpan ke redis
      redis.setEx(`getMovie:${JSON}`, 3600, JSON.stringify(result));

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
      const { filename } = request.file;
      // console.log(request.file);
      const {
        name,
        category,
        director,
        cast,
        releaseDate,
        duration,
        synopsis,
      } = request.body;

      const setData = {
        name,
        category,
        image: filename,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      };

      const result = await movieModel.createMovies(setData);
      return helperWrapper.response(response, 200, "sukses post data", result);
    } catch (error) {
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

      const { filename } = request.file;
      const {
        name,
        category,
        director,
        cast,
        releaseDate,
        duration,
        synopsis,
      } = request.body;

      const setData = {
        name,
        category,
        image: filename,
        director,
        cast,
        releaseDate,
        duration,
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

      // (error, result) => {console.log(result, error)}
      cloudinary.uploader.destroy(cekId[0].image, () => {
        console.log("data berhasil di delete di cloudinary");
      });

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
