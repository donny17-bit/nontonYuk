const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helpers/wrapper");

// jika menyimpan di cloud/cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nontonYuk/movies",
  },
});

// // jika menyimpan di local
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/uploads/movie");
//   },

//   filename(req, file, cb) {
//     // console.log(file);
//     // file = {
//     //   fieldname: 'image',
//     //   originalname: 'LogoFazztrack.png',
//     //   encoding: '7bit',
//     //   mimetype: 'image/png'
//     // }
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

// file filter implement express multer kata kunci

const upload = multer({
  storage,
  fileFilter(request, file, callback) {
    const { mimetype } = file;
    if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
      return callback(new Error("File harus berekstensi png atau jpg"));
    }
    return callback(null, true);
  },
  limits: {
    fileSize: 1024000,
  },
}).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      return helperWrapper.response(response, 401, error.message, null);
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
