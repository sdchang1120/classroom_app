// REQUIREMENTS
var express = require('express'),
    router  = express.Router();

var User    = require('../models/users'),
    Room    = require('../models/rooms');

// ROOMS - INDEX
router.get('/', isLoggedIn, function(req, res) {
  res.locals.login = req.isAuthenticated();
  User.aggregate({$unwind: '$rooms'}, {$group: {_id: '$rooms._id', name: {$addToSet: '$rooms.name'}, uid: {$addToSet: '$_id'}, first_name: {$addToSet: '$first_name'}}}, function(err, data) {
    res.render('rooms/index.ejs', { rooms: data, userLogin: req.user });
  })
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
