var express = require('express');
var router = express.Router();
var controller = require("./controller");
var auth_middleware = require('../../middleware/authMiddware');

router.use(auth_middleware);

router.get('/', controller.get);
router.put('/', controller.update);

router.get('/user', controller.getByUser);

module.exports = router;
