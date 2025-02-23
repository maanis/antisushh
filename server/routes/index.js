var express = require('express');
const { register } = require('../controllers/auth');
var router = express.Router();

router.get('/', function (req, res) {
  res.send('hey');
});

router.post('/register', register);



module.exports = router;
