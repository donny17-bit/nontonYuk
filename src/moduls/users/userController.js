const bcrypt = require("bcryptjs");
const helperWrapper = require("../../helpers/wrapper");
const userModel = require("./userModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getUserById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModel.getUserById(id);

      return helperWrapper.response(
        response,
        200,
        "sukses get user id",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  updateUserProfile: async (request, response) => {
    try {
      const { id } = request.params;
      const cekIdUser = await userModel.getUserById(id);

      if (cekIdUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          `user dengan id = ${id} tidak ada`,
          null
        );
      }

      const { firstName, lastName, noTelp } = request.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        updatedAt: new Date(Date.now()),
      };

      const result = await userModel.updateUserProfile(id, setData);

      return helperWrapper.response(
        response,
        200,
        "sukses update user profile",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  updateUserPassword: async (request, response) => {
    try {
      const { id } = request.params;
      const cekIdUser = await userModel.getUserById(id);

      if (cekIdUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          `user dengan id = ${id} tidak ada`,
          null
        );
      }

      const { newPassword, confirmPassword } = request.body;
      // encrypt password
      const hash = bcrypt.hashSync(newPassword);

      // cek kondisi jika new password beda dengan confirm password
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          404,
          "new password doesn't match with confirm password",
          null
        );
      }

      const setData = {
        password: hash,
        updatedAt: new Date(Date.now()),
      };

      const result = await userModel.updateUserPassword(id, setData);

      return helperWrapper.response(
        response,
        200,
        "sukses update user password",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },

  updateUserImage: async (request, response) => {
    try {
      const { id } = request.params;
      const cekIdUser = await userModel.getUserById(id);
      // kurang delete image user di cloudinary
      let { filename } = request.file;
      const { mimetype } = request.file;

      if (mimetype === "image/jpeg") {
        filename += ".jpg";
      } else if (mimetype === "image/png") {
        filename += ".png";
      }

      if (cekIdUser.length < 1) {
        return helperWrapper.response(
          response,
          404,
          `user dengan id = ${id} tidak ada`,
          null
        );
      }

      if (cekIdUser[0].image) {
        cloudinary.uploader.destroy(cekIdUser[0].image, () => {
          console.log("data has been deleted in cloudinary");
        });
      }

      const setData = {
        image: filename,
        updatedAt: new Date(Date.now()),
      };

      const result = await userModel.updateUserImage(id, setData);

      return helperWrapper.response(
        response,
        200,
        "sukses update user image",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "bad request", null);
    }
  },
};
