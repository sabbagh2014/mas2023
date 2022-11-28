const multer = require("multer");
const path = require("path");
const Boom = require("@hapi/boom");

class UploadHandler {
  constructor(fileSize) {
    this.fileSize = fileSize;
    this.max_image_size = 204800;
    this.max_video_size = 2048000;
    this.storage = multer.diskStorage({
      destination(req, file, cb) {
        const root = path.normalize(`${__dirname}/../..`);
        cb(null, `${root}/uploads/`);
      },
      filename(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname.replace(/\s/g, "")}`);
      },
    });
    this.uploadFile = this.uploadFile.bind(this);
  }

  handleUploadError(req, res, next, upload) {
    upload(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(Boom.badRequest(err, "File size limit exceeds"));
        }
        return next(Boom.badRequest(err, "Error in file upload"));
      }
      return next();
    });
  }

  uploadFile(req, res, next) {
    const upload = multer({
      storage: this.storage,
      fileFilter: function (req, file, cb) {
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png' && 
            ext !== '.jpg' && 
            ext !== '.jpeg' && 
            ext !== '.gif' && 
            ext !== '.mp4' && 
            ext !== '.svg') {
            return cb(Boom.badRequest('file format not allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1000000 * 90,
      },
    }).any();
    this.handleUploadError(req, res, next, upload);
  }
}

module.exports = new UploadHandler(10);
