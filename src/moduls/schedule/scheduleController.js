const helperWrapper = require("../../helpers/wrapper");
const scheduleModel = require("./scheduleModel");

module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      const { searchLocation } = request.query;
      let { page, limit, searchMovieId, sort } = request.query;

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

      if (sort === undefined) {
        sort = "location";
      }
      // dibikin falsy (!) = if (!sort) { blabla}

      // cek apakah salah satu dari searchMovieId / searchLocation ada atau tidak
      // agar tidak salah di querynya
      if (searchMovieId === undefined) {
        if (searchLocation) {
          searchMovieId = undefined;
        } else {
          searchMovieId = "";
        }
      }

      const offset = page * limit - limit;
      const totalData = await scheduleModel.getTotalSchedule();
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await scheduleModel.getAllSchedule(
        searchLocation,
        searchMovieId,
        sort,
        limit,
        offset
      );

      return helperWrapper.response(
        response,
        200,
        "sukses get schedule",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  getScheduleById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);

      return helperWrapper.response(
        response,
        200,
        `sukses get schedule by id ${id}`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  createSchedule: async (request, response) => {
    try {
      const { movieId, premiere, price, location } = request.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
      };

      const result = await scheduleModel.createSchedule(setData);

      return helperWrapper.response(
        response,
        200,
        "sukses create schedule",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  updateSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await scheduleModel.getScheduleById(id);

      if (cekId.length <= 0) {
        return helperWrapper.response(
          response,
          400,
          `schedule dengan id: ${id} tersebut tidak ad`,
          null
        );
      }

      const { movieId, premiere, price, location } = request.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
      };

      const result = await scheduleModel.updateSchedule(id, setData);
      return helperWrapper.response(
        response,
        200,
        "sukses update schedule",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  deleteSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const cekId = await scheduleModel.getScheduleById(id);

      if (cekId.length <= 0) {
        return helperWrapper.response(
          response,
          400,
          `schedule dengan id: ${id} tersebut tidak ada`,
          null
        );
      }

      const result = await scheduleModel.deleteSchedule(id);

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
