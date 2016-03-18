var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var passportLocal = require('passport-local');
var expressSession = require('express-session');

var bcrypt = require('bcrypt');

//-------------------- mongoDB -------------------
mongoose.connect('mongodb://localhost/todo');
var users = mongoose.model('users', {
    email: String,
    token: String,
    password: String,
    active: Boolean
});
var tasks = mongoose.model('tasks', {
    email: String,
    content: String,
    status: String,
    time: Number
});

//-------------------- nodemailer -------------------

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Easenote@gmail.com', // Your email id
        pass: 'xYh-Avg-XB8-nz7' // Your password
    }
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

        users.findOne({email: email}, function(err, user) {
            console.log("passportLocal.Strategy", user);
            
            // email doesn't exist
            if(!user) {
                done(null, null);
            }
            // passowrd not correct
            else if(!bcrypt.compareSync(password, user.password)) {
                don(null, null);
            }
            else {
                done(null, {email: user.email});
            }
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
    
    res.json(req.user.email);
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
            
            // convert plain text password into hash
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(user.password, salt);
            user.password = hash;
            
            // create a hash for email, for verify and reset password
            salt = bcrypt.genSaltSync(10);
            hash = bcrypt.hashSync(user.email, salt);
            user.token = hash;
            user.active = false;
            
            users(user).save();

            // send a active mail to user
            var mailOptions = {
                from: 'Easenote@gmail.com', // sender address
//                to: user.email,
                to: 'xubinglin@hotmail.com', // list of receivers
                subject: 'Confirm your email address on EaseNote', // Subject line
                html: "<style>body {font-family:Arial, sans-serif;text-align: center;color: #3d3535;} #out-rect {border: lightgray 1px solid;border-radius: 3px; width: 60%; display: inline-block; padding: 20px; color: gray; margin:auto;} #verify-btn {background: #1cb78c;color: white;border-radius: 3px; width: 50%; min-width: 200px; height: 3em; display: inline-block; line-height: 3em;} #verify-btn a {display:inline-block;width: 100%;color: white;text-decoration:none;}</style> <h1>Welcome to EaseNote!</h1> <div id='out-rect'><p>Congratulations on reaching EaseNote, a useful website to help you manage your tasks. Your account is "
                + user.email
                + ". Please click on the following link to verify your email address:</p> <div id='verify-btn'><a href='http://localhost:3000/users/verifyemail/"
                + user.token.replace('/', '%2F')
                + "'>VERIFY YOUR EMAIL</a></div></div>"
            };
    
            sendMail(mailOptions);
            
            res.json(true);
        }    
    });
})

var sendMail = function(options) {
        
    transporter.sendMail(options, function(error, info){
        if(error){
            console.log('Send mail error', error);
        }else{
            console.log('Mail sent: ' + info.response);
        };
    });
}


router.get('/verifyemail/:hash', function(req, res) {
    var hash = req.params.hash;
    
    console.log("verifyemail", hash);
    users.findOne({token: hash}, function(err, user) {
        console.log("verifyemail", user, hash);
        
        if(!user) {
            console.log("verify email: no user found");
            
            res.render('feedback', {title: 'Invalid approach!',
                                message: 'Please use the link that has been send to your email.'});
        }
        else if (user.active) {
            console.log("verify email: already active");

            res.render('feedback', {title: 'Already verified', message: "You had already verified your Email address. Please visit <a href='http://localhost:3000'>Easenote</a> and login."});
        }
        else {
            console.log("verify email: success");
            
            user.active = true;
            // update to mongoDB
            user.save();
            res.render('feedback', {title: "Congratulation!", message: "Your Easenote account has been activated, you can visit <a href='http://localhost:3000'>Easenote</a> and login now!"})
        }
    });
    
})


module.exports = router;
