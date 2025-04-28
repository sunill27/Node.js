// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
//     if (!allowedFileTypes.includes(file.mimetype)) {
//       cb(new Error("This file type is not supported."));
//       return;
//     }
//     cb(null, "./storage"); //cb takes two parameters error or success string
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// module.exports = { multer, storage };

// SECOND METHOD IMPLEMENTED
const multer = require("multer");
// Allowed file types
const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./storage"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer instance with file size & type validation
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    if (!allowedFileTypes.includes(file.mimetype)) {
      return cb(new Error("This file type is not supported."), false);
    }
    cb(null, true);
  },
});

module.exports = { upload };
