var express = require('express');
var router = express.Router();
const controller = require('../controllers/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//router.post('/lookup',controller.lookup);
router.post('/registeraccount',controller.register);
router.post('/paypalpayment',controller.paypalpayment)
router.post('/cryptopayment',controller.cryptopayment);

module.exports = router;
