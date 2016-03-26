var express = require('express'),
    router  = express.Router();

var User    = require('../models/users'),
    Room    = require('../models/rooms');

// ROOMS - INDEX
router.get('/', isLoggedIn, function(req, res) {
res.locals.login = req.isAuthenticated();
  Room.find(function(err, rooms) {
    res.render('rooms/index.ejs', { rooms: rooms, userLogin: req.user });
  });
});

// ROOMS - SHOW
router.get('/:room_id', isLoggedIn, function(req, res) {
	// for user control flow within template (enables editing only on the user's own page)
	req.params.id == req.user.id ? res.locals.usertrue = true : res.locals.usertrue = false;
	res.locals.login = req.isAuthenticated();
	Room.findById(req.params.room_id, function(err, room) {
		res.render('rooms/show.ejs', { room: room, userLogin: req.user });
	});
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
