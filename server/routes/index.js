var express = require('express');
const { register, login } = require('../controllers/auth');
var router = express.Router();

router.get('/', function (req, res) {
  res.send('hey');
});

router.post('/register', register);

router.post('/login', login);



module.exports = router;
