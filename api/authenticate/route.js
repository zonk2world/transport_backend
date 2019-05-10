var express = require ('express');
var router = express.Router();
var controller = require('./controller');

router.post('/', controller.auth);
router.post('/logout', (req, res, next) => {
    return res.status(200).send({response: "success"});
});

module.exports = router;