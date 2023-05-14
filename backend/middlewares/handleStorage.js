const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const pathStorage = `${__dirname}/../storage`;
    cb(null, pathStorage);
  },
  filename: function (_req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const filename = `file-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const uploadFiles = multer({ storage });

module.exports = uploadFiles;
