// REQUIREMENTS
var express  = require('express'),
    passport = require('passport'),
    router   = express.Router();

var User    = require('../models/users');

// HOME PAGE
router.get('/', function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.find(function(err, users) {
  	res.render('index.ejs', { users: users, userLogin: req.user });
  });
});

// ABOUT PAGE
router.get('/about', function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.find(function(err, users) {
  	res.render('static/about.ejs', { users: users, userLogin: req.user });
  });
});

// SIGNUP PAGE
router.get('/signup', function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.find(function(err, users) {
    res.render('static/signup.ejs', { users: users, userLogin: req.user });
  });
});

// LOGIN PAGE
router.get('/login', function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.find(function(err, users) {
    res.render('static/login.ejs', { users: users, userLogin: req.user });
  });
});

// SIGNUP - CREATE NEW USER
router.post('/', passport.authenticate('local-signup', {
  failureRedirect: '/users' }), function(req, res) {
    //success redirect goes to show page
    res.redirect('/users/' + req.user.id);
});

// LOGIN EXISTING USER
router.post('/login', passport.authenticate('local-login', {
	failureRedirect: '/login' }), function(req, res) {
    // success redirect goes to show page
    res.redirect('/users/' + req.user.id);
});

// LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// MIDDLEWARE TO CHECK LOGIN STATUS
function isLoggedIn(req, res, next) {
	// console.log('isLoggedIn middleware');
  if (req.isAuthenticated()) {
  	return next();
  } else {
  	res.redirect('/');
  }
}

module.exports = router;
