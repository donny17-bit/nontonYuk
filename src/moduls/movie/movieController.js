const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const cloudinary = require("../../config/cloudinary");
const movieModel = require("./movieModel");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      const { searchRelease, searchName } = request.query;
      let { page, limit, sort } = request.query;

      // check is page empty or not
      if (page) {
        page = Number(page);
      } else {
        page = 1;
      }

      // check is limit empty or not
      if (limit) {
        limit = Number(limit);
      } else {
        limit = 5;
      }

      if (!sort) {
        sort = "id";
      }

      // if (!searchName) {
      //   searchName = "";
      // }

      const offset = page * limit - limit;
      const totalData = await movieModel.getTotalMovies(
        searchName,
        searchRelease
      );
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
        offset,
        searchRelease
      );

      redis.setEx(
        `getMovie:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
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
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));

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

  // msh bug, kalo bkn admin yg login dan file di isi tidak menampilkan error(harus admin can create movie)
  createMovies: async (request, response) => {
    try {
      let { filename } = request.file;
      const { mimetype } = request.file;
      // const { type } = request.file;

      if (mimetype === "image/jpeg") {
        filename += ".jpg";
      } else if (mimetype === "image/png") {
        filename += ".png";
      }

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

      // cek di req.file ada image atau tidak
      // didalam kondisi

      const { mimetype } = request.file;
      let { filename } = request.file;

      if (mimetype === "image/jpeg") {
        filename += ".jpg";
      } else if (mimetype === "image/png") {
        filename += ".png";
      }

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
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const { image } = cekId[0].image;

      if (image) {
        cloudinary.uploader.destroy(image.slice(0, image.length - 4), () => {
          console.log("data has been deleted in cloudinary");
        });
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

      const { image } = cekId[0].image;

      // msih ngebug, di cloudinary blm kedelete pdhl dlu bsa
      if (image) {
        cloudinary.uploader.destroy(image.slice(0, image.length - 4), () => {
          console.log("data has been deleted in cloudinary");
        });
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
