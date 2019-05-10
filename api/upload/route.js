var express = require('express');
var router = express.Router();
var uploadController = require('./controller');
var authMiddware = require('../../middleware/authMiddware');

//router.use(authMiddware);


router.post('/', uploadController.upload);
router.post('/multi', uploadController.uploadMultiImages);
router.post('/single', uploadController.uploadSingleFile);

module.exports = router;
