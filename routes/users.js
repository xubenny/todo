var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res) {
    console.log('post/users/login', req.body);
//    res.json({username: req.body.username});
    res.status(500).send({ error: "user does not exist" });
})

module.exports = router;
