// ==============================
//          REQUIREMENTS
// ==============================

var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    session        = require('express-session'),
    // server         = require('http').createServer(app),
    // webRTC         = require('webrtc.io').listen(server),
    webRTC         = require('webrtc.io').listen(8001),
    mongoUri       = process.env.MONGOLAB_URI || 'mongodb://localhost/classroom_app',
    port           = process.env.PORT || 3000,
    app            = express();

// ==============================
//           MIDDLEWARE
// ==============================

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

// WEBRTC
webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});

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
