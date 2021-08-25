const multer = require('multer');

const documentFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/doc' || file.mimetype === 'application/ppt') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const document = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/studyMaterial/');
    },
    filename: function (req, file, cb) {

        cb(null, "document_" + new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

module.exports.document = multer({
    storage: document,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: documentFilter,
}).single('document')
