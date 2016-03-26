// REQUIREMENTS
var express  = require('express'),
		passport = require('passport'),
    router   = express.Router();

var User     = require('../models/users'),
    Room 		 = require('../models/rooms');

// USERS - INDEX
router.get('/', function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.find(function(err, users) {
  	res.render('users/index.ejs', { users: users, userLogin: req.user });
  });
});

// USERS - JSON for testing
router.get('/json', function(req, res) {
  User.find(function(err, users) {
  	res.send(users);
  });
});

// LOGOUT
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users');
});

// USERS - SHOW - IF LOGGED IN
router.get('/:id', isLoggedIn, function(req, res) {
  // for user control flow within template (enables editing only on the user's own page)
  req.params.id == req.user.id ? res.locals.usertrue = true : res.locals.usertrue = false;
  res.locals.login = req.isAuthenticated();
  User.findById(req.params.id, function(err, user) {
  	res.render('users/show.ejs', { user: user, userLogin: req.user });
  });
});

// saves a new room to the room model and the User's rooms list
router.post('/:id/newroom', function(req, res) {
	User.findById(req.params.id, function(err, user) {
		var room = new Room(req.body);
		room.save(function(err, room) {
			user.rooms.push(room);
			user.save(function(err, user) {
				// res.redirect('/users/' + req.params.id);
				// console.log(room.id)
				res.redirect('/rooms/'+room.id);
			});
		});
	});
});

// SIGNUP - CREATE NEW USER
router.post('/', passport.authenticate('local-signup', {
  failureRedirect: '/users' }), function(req, res) {
    //success redirect goes to show page
    res.redirect('/users/' + req.user.id);
});

// LOGIN
router.post('/login', passport.authenticate('local-login', {
	failureRedirect: '/users' }), function(req, res) {
    // success redirect goes to show page
    res.redirect('/users/' + req.user.id);
});

// DELETE USER
router.delete('/:id', function(req, res) {
  console.log('DELETE ROUTE ACCESSED');
  User.findById(req.params.id, function(err, user) {
  	if (user.rooms.length == 0) {
  		user.remove(function(err) {
  			res.redirect('/users');
  		});
  	} else {
  		user.rooms.forEach(function(room) {
  			Room.findOneAndRemove({ _id: room.id }, function(err) {
  				if (err) console.log(err);
  			});
  		});
  		user.remove(function(err) {
  			res.redirect('/users');
  		});
  	} // end if
  }); // end User find
});

// MIDDLEWARE TO CHECK LOGIN STATUS
function isLoggedIn(req, res, next) {
	console.log('isLoggedIn middleware');
  if (req.isAuthenticated()) {
  	return next();
  } else {
  	res.redirect('/users');
  }
}

module.exports = router;
