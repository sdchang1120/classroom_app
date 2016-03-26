var User = require('../models/users');
var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport) {
	console.log('passport config invoked');

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

  // =====================
	//       SIGNUP
	// =====================
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {

		console.log('Req.body within local signup: ', req.body);

		User.findOne({ 'email': email }, function(err, user) {
			if (err) { return done(err) }
			if (user) {
				return done(null, false);
			} else {
				var newUser = new User();

				// set the user's local credentials
        newUser.username = req.body.username;
        newUser.first_name = req.body.first_name;
        newUser.last_name = req.body.last_name;
        newUser.email = email;
        newUser.password = newUser.generateHash(password);

				newUser.save(function(err) {
					if (err) {
						console.log(err)
						throw err
					} else {
						return done(null, newUser);
					}
				}); // end user save
			} // end user check exists
		}) // end find user

	} // end localstategy params

	)); // end passport local signup



	// =====================
	//       LOGIN
	// =====================

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, username, password, done) {

		User.findOne({ 'username': username }, function(err, user) {
			if (err) { return done(err) }

			if (!user) {
				console.log('NO USER FOUND');
				return done(null, false);
			}

			if (!user.validPassword(password)) {
				return done(null, false);
			}

			return done(null, user);
		}); // end find user

	} // end localstrategy params

	)); // end passport local login


} // end module
