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
    webRTC         = require('webrtc.io').listen(8080),
    mongoUri       = process.env.MONGOLAB_URI || 'mongodb://localhost/classroom_app',
    port           = process.env.PORT || 3000,
    app            = express(),
    http           = require('http').Server(app),
    io             = require('socket.io')(http);


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

// CHATROOM

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
      timestamp: Date.now()
    });
    console.log('message sent!');
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

  // DRAWING BOARD

  // Start listening for mouse move events
	socket.on('mousemove', function (data) {

		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('moving', data);
	});


});

// // Listen for incoming connections from clients
// io.sockets.on('connection', function (socket) {
//
// 	// Start listening for mouse move events
// 	socket.on('mousemove', function (data) {
//
// 		// This line sends the event (broadcasts it)
// 		// to everyone except the originating client.
// 		socket.broadcast.emit('moving', data);
// 	});
// });

// ==============================
//           CONNECTION
// ==============================

// mongoose.connection.once('open', function() {
http.listen(port, function() {
  // app.listen(port, function() {
  console.log('=========================');
  console.log('listening on port:', port);
  console.log('=========================');
  // });
});
// });


// io.on('connection', function(socket) {
//
//   io.emit('boioing', "test massage");
//
// });


// WEBRTC
// webRTC.rtc.on('chat_msg', function(data, socket) {
//   var roomList = webRTC.rtc.rooms[data.room] || [];
//
//   for (var i = 0; i < roomList.length; i++) {
//     var socketId = roomList[i];
//
//     if (socketId !== socket.id) {
//       var soc = webRTC.rtc.getSocket(socketId);
//
//       if (soc) {
//         soc.send(JSON.stringify({
//           "eventName": "receive_chat_msg",
//           "data": {
//             "messages": data.messages,
//             "color": data.color
//           }
//         }), function(error) {
//           if (error) {
//             console.log(error);
//           }
//         });
//       }
//     }
//   }
// });
