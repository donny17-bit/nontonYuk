const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");

module.exports = {
  register: async (request, response) => {
    try {
      // 1. encript password

      //   optional
      // 3. password minimal berapa, harus angka atau huruf besar, dll

      const { email, firstName, password, image, noTelp, role, status } =
        request.body;

      let setData = {
        email,
        firstName,
        image,
        noTelp,
        role,
        status,
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
      const hash = bcrypt.hashSync(password, 8);
      // tanya soal salt

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

      // 2. jika password salah
      // encripsi password bisa pake cvrypt/ crypto
      if (cekEmail[0].password !== password) {
        return helperWrapper.response(response, 400, "wrong password", null);
      }

      //   proses JWT
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
};
