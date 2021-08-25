const multer = require('multer');

const videoFilter = (req, file, cb) => {    
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/*') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const video = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/videos/');
    },
    filename: function (req, file, cb) {

        cb(null, "video_" + new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

module.exports.videoUpload = multer({
    storage: video,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: videoFilter,
}).single('video')
