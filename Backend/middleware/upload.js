const multer = require('multer');
const path = require('path');
const fs = require('fs');

const videoDir = path.join(__dirname, '../uploads/videos');
const thumbDir = path.join(__dirname, '../uploads/thumbnails');


[videoDir, thumbDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, videoDir);
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, thumbDir);
    } else {
      cb(new Error('Unsupported file type'), null);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});

const upload = multer({ storage });
module.exports = upload;
