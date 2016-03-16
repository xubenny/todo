var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo');

users = mongoose.model('users', {
    email: String,
    password: String
});


router.post('/login', function(req, res) {

    console.log('post/users/login', req.body);
    
    users.findOne({email: req.body.email, password: req.body.password}, 
        function(err, user) {
        
            // err mean system access error
            if(err) return console.error(err);
        
            if(user) {
                console.log('login success');
                res.json({email: req.body.email});
            }
            else {
                console.log('login fail');
                res.status(500).send({ error: "Email or password does not match!" });
            }
        }
    );
})

module.exports = router;
