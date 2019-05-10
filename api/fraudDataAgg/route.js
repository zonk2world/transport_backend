const express = require('express');
const router = express.Router();
const auth_middleware = require('../../middleware/authMiddware');
const controller = require('./controller');

router.use(auth_middleware);

router.get('/', controller.getFraudDataAgg);
router.post('/', controller.postFraudDataAgg);

module.exports = router;