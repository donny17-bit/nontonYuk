const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// jika menyimpan di cloud/cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nontonYuk/user",
  },
});

// // jika menyimpan di local
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/uploads/movie");
//   },

//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

// bikin limit dan ektenesi di middleware
// file filter implement express multer kata kunci

const upload = multer({ storage }).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      return helperWrapper.response(response, 401, error.message, null);
      // limit = file to large => error limit
      // extensi = custom
      // A Multer error occurred when uploading.
    }
    if (error) {
      return helperWrapper.response(response, 401, error.message, null);
      // An unknown error occurred when uploading.
    }
    return next();
  });
};

module.exports = handlingUpload;
