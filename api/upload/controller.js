const multer = require('multer');
const fs = require('fs');

// multer setup
const DIR = './uploads/';
// multer disk storage settings

fs.exists(DIR, function(exists) {
    if (!exists) {
        fs.mkdir(DIR, function (err) {
            if (err) {
                console.log('Error in folder creation');
            }
        });
    }
});


const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function (req, file, cb) {
        const datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

const uploadImage = (req, res, next) => {
    const upload = multer({ storage: storage }).single('upload');
    let path = '';
    upload(req, res, function (err) {
        if (err) {
            console.log("err :", err.toString());
            return res.status(422).send("an Error occured")
        }
        if (req.file && req.file.path) {
            path = req.file.path;
        }
        return res.json(path);
    });
};

const uploadMultiImages = (req, res, next) => {
    const upload = multer({ storage: storage }).array("uploads", 12);
    let path = [];
    upload(req, res, function (err) {
        if (err) {
            return res.status(422).send("an Error occured")
        }
        req.files = req.files || [];
        req.files.forEach(item => {
            if (item && item.path) {
                path.push(item.path);
            }
        });
        return res.json(path);
    });
};

const uploadSingleFile = (req, res, next) => {
    const upload = multer({ storage: storage }).single("upload");
    let path = '';
    upload(req, res, function (err) {
        if (err) {
            return res.status(422).send("an Error occured")
        }
        if (req.file && req.file.path) {
            path = req.file.path;
        }
        return res.json(path);
    });
};
exports.upload = uploadImage;
exports.uploadMultiImages = uploadMultiImages;
exports.uploadSingleFile = uploadSingleFile;
