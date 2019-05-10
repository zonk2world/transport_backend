var express = require('express');
var router = express.Router();
var auth_middleware = require('../../middleware/authMiddware');
var controller = require('./controller');

router.use(auth_middleware);

router.post('/', controller.create);
router.get('/', controller.get);
router.get('/getStops', controller.getStops);

module.exports = router;


