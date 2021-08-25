const multer = require('multer');

const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/*') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const image = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {

        cb(null, "image_" + new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

module.exports.image = multer({
    storage: image,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: imageFilter,
}).single('image')
