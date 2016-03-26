// ==============================
//          REQUIREMENTS
// ==============================

var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    session        = require('express-session'),
    mongoUri       = process.env.MONGOLAB_URI || 'mongodb://localhost/classroom_app',
    port           = process.env.PORT || 3000,
    app            = express();

// connect to mongo
mongoose.connect(mongoUri);

// load passport config
require('./config/passport')(passport);

// access public directory
app.use(express.static('public'));

// configure body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure passport
app.use(session({ name: 'classroom_app', secret: 'peanut butter jelly' }));
app.use(passport.initialize());
app.use(passport.session());

// configure method-override
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// ==============================
//          CONTROLLERS
// ==============================

// ROOMS CONTROLLER
roomsController = require('./controllers/roomsController');
app.use('/rooms', roomsController);

// USERS CONTROLLER
usersController = require('./controllers/usersController');
app.use('/users', usersController);

// root redirects to users index
app.get('/', function(req, res) {
	res.redirect('/users');
});

// ==============================
//           CONNECTION
// ==============================

mongoose.connection.once('open', function() {
  app.listen(port, function() {
    console.log('=========================');
    console.log('listening on port:', port);
    console.log('=========================');
  });
});
