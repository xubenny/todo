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
var tasks = mongoose.model('tasks', {
    email: String,
    content: String,
    status: String,
    time: Number
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
    
    res.json(true);
    console.log("success", req.user);
})

router.post('/addtask', function(req, res) {
    
    if(!req.isAuthenticated()) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    var task = req.body;
    task.email = req.user.email;

    console.log("post/users/addtask", task);
    
    // use mongoose method insert a doc to DB
    tasks(task).save();
    
    res.json(true);
})

router.get('/getstatus', function(req, res) {
    
    if(!req.isAuthenticated()) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    res.json(req.user.email);
})

router.get('/logout', function(req, res) {

    if(!req.isAuthenticated()) {
        res.status(401).send("Unauthorized");
        return;
    }

    console.log("get/users/logout");
    req.logout();
    res.json(true);
})

router.get('/gettasks', function(req, res) {
    
    if(!req.isAuthenticated()) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    console.log('get/users/gettasks');
    tasks.find({email: req.user.email}, {_id:0, content:1, status:1, time:1}, function(err, tasklist) {
        res.json(tasklist);
    })

})

router.post('/signup', function(req, res) {
    
    var user = req.body;
    console.log("post/signup", user);
    
    users.findOne({email: user.email}, function(err, doc) {
        if(doc) {
            console.log("signup error: user already exist", doc);
            res.status(500).send("user already exist");
        }
        else {
            console.log("signup success");
            
            users(user).save();
            res.json(true);
        }    
    });
})

module.exports = router;
