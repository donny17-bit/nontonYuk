const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const { sendMail } = require("../../helpers/mail");
const redis = require("../../config/redis");

module.exports = {
  register: async (request, response) => {
    try {
      //   optional
      // 3. password minimal berapa, harus angka atau huruf besar, dll
      // 4. kondisi email lebih lengkap, harus diakhiri .com, dll

      const { email, firstName, lastName, password, noTelp } = request.body;

      // uuid baru di register doang / table user di db
      let setData = {
        id: uuidv4(),
        email,
        firstName,
        lastName,
        noTelp,
      };

      console.log(setData);

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

      const setSendEmail = {
        to: email,
        subject: "Email Verification !",
        name: firstName,
        template: "verificationEmail.html",
        link: `google.com`,
      };
      await sendMail(setSendEmail);

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
      const token = jwt.sign({ ...payload }, "RAHASIA", {
        expiresIn: "1hr",
      });
      const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
        expiresIn: "24h",
      });

      return helperWrapper.response(response, 200, "success login", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  refresh: async (request, response) => {
    try {
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }
      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        delete result.iat;
        delete result.exp;
        const token = jwt.sign(result, "RAHASIA", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(result, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

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

  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
