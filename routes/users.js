var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var passportLocal = require('passport-local');
var expressSession = require('express-session');

//-------------------- mongoDB -------------------
mongoose.connect('mongodb://localhost/todo');
var users = mongoose.model('users', {
    email: String,
    password: String
});

//-------------------- passport ------------------
router.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'looking for job',
	resave: false,
	saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new passportLocal.Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {

        users.findOne({email: email, password: password}, {_id:0, email:1}, function(err, user) {
            // if success, db will give an object {_id:..., email:..., password:...}
            // if fail, db will give a 'null'
            console.log("passportLocal.Strategy", user);
            done(null, user);
        });
    })
);

// the 'user' param is from passportLocal.Strategy
// serialize mean from user to an unique ID
passport.serializeUser(function(user, done) {
    console.log("passport.serializeUser", user);
    done(null, user.email);
});

// deserialize mean from unique ID to user
passport.deserializeUser(function(email, done) {
    users.findOne({email: email}, {_id:0, email:1}, function(err, user) {
        console.log("passport.deserializeUser", user);
        done(null, user);
    })
});

//-------------------- router --------------------

router.post('/login', passport.authenticate('local'), function(req, res) {

    // req.isAuthenticated() is not needed, passport will return '401' error (Unauthorized) if fail
    console.log('post/users/login success', req.body);
    
    res.json(req.user);
    console.log("success", req.user);
})

module.exports = router;
