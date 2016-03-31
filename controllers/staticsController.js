var express = require('express'),
    router = express.Router();

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
