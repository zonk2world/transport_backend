var express = require('express');
var router = express.Router();
var controller = require("./controller");
var auth_middleware = require('../../middleware/authMiddware');

router.use(auth_middleware);

router.post('/', controller.create);
router.get('/', controller.getAllNetworkparams);
router.put('/', controller.update);

module.exports = router;
