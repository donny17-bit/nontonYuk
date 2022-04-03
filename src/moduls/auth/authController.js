const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");

module.exports = {
  register: async (request, response) => {
    try {
      //   optional
      // 3. password minimal berapa, harus angka atau huruf besar, dll
      // 4. kondisi email lebih lengkap, harus diakhiri .com, dll

      const { email, firstName, lastName, password, noTelp } = request.body;

      let setData = {
        email,
        firstName,
        lastName,
        noTelp,
      };

      // 2. proses kondisi, cek apakah email sudah terdaftar belum
      const cekEmail = await authModel.getUserByEmail(email);

      if (cekEmail.length >= 1) {
        return helperWrapper.response(
          response,
          404,
          "Email tersebut telah terdaftar",
          null
        );
      }

      // encrypt password
      const hash = bcrypt.hashSync(password);

      setData = { ...setData, password: hash };
      const result = await authModel.register(setData);
      return helperWrapper.response(response, 200, "sukses register", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  login: async (request, response) => {
    try {
      const { email, password } = request.body;
      const cekEmail = await authModel.getUserByEmail(email);

      //   1. jika email tidak ada di database
      if (cekEmail.length < 1) {
        return helperWrapper.response(
          response,
          400,
          "email belum terdaftar",
          null
        );
      }

      // cek user sudah activate belum
      if (cekEmail[0].status !== "active") {
        return helperWrapper.response(
          response,
          400,
          "silahkan lakukan aktivasi email terlebih dahulu",
          null
        );
      }

      // 2. jika password salah
      // encripsi password pake bcryptjs
      if (!bcrypt.compareSync(password, cekEmail[0].password)) {
        return helperWrapper.response(response, 400, "wrong password", null);
      }

      // //   proses JWT
      const payload = cekEmail[0];
      delete payload.password;

      // RAHASIA merupakan secret key/nama kunci (nama bebas)
      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "24hr" });
      return helperWrapper.response(response, 200, "success login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  // activate user masih manual (-)
  // belum bisa kirim link ke email user
  activate: async (request, response) => {
    try {
      const { id } = request.params;
      const cekIdUser = await authModel.getUserById(id);

      //   1. jika user tidak ada di database
      if (cekIdUser.length < 1) {
        return helperWrapper.response(
          response,
          400,
          "user tidak ditemukan",
          null
        );
      }

      const result = await authModel.activate(id, cekIdUser[0]);
      return helperWrapper.response(
        response,
        200,
        "success activate user",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
