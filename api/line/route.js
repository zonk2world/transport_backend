var express = require('express');
var router = express.Router();
var controller = require("./controller");
var auth_middleware = require('../../middleware/authMiddware');

router.use(auth_middleware);

router.get('/', controller.getLines);
router.post('/', controller.addLine);
router.get('/stopIds', controller.getStopIdsByLineName);
router.post('/updateStopIds', controller.updateStopIds);
router.get('/getLineByShortName', controller.getLineByShortName);

module.exports = router;
