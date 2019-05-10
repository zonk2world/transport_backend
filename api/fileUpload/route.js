var express = require('express');
var router = express.Router();
var controller = require("./controller");
var auth_middleware = require('../../middleware/authMiddware');

router.use(auth_middleware);

router.post('/', controller.createRoutes);
router.get('/', controller.getStopIndices);
router.get('/getTimesByTripId', controller.getTimesByTripId);

module.exports = router;
