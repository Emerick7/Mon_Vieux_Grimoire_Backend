const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"));
    }
};

exports.imageUploader = multer({
    storage,
    fileFilter: filter
});

exports.imgResize = async (req, res, next) => {
    if(req.file) {
        const name = req.file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[req.file.mimetype];
        const newName = name + Date.now() + '.' + extension;

        const path = `./images/${newName}`;

        await sharp(req.file.buffer)
            .resize(207, 260)
            .toFile(path);
        res.locals.newName = newName;
        next();
    } else {
        next();
    }
};