console.log('draw.js');

// More on canvas drawing here: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
var lastX, lastY;
var context;

$(function(){

	var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var context = canvas.getContext('2d');
	 var width   = $(window).width() - 400;
	//  console.log('CANVAS WIDTH:', width);
   var height  = window.innerHeight - 43;
	//  console.log('CANVAS HEIGHT:', height);
   var socket  = io.connect();

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
	 $('#drawing').mousedown(function (e) {
    mouse.click = true;
  });

   $('#drawing').mouseup(function (e) {
		 mouse.click = false;
	 });

   $('#drawing').mousemove(function (e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   });

   // draw line received from server
	socket.on('draw_line', function (data) {
		console.log(line)
      var line = data.line;
			// lastX = x; lastY = y;
      context.beginPath();
			context.strokeStyle = $('#selColor').val();
	    context.lineWidth = $('#selWidth').val();
	    context.lineJoin = "round";
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
			context.closePath();
      context.stroke();
   });

   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', {
					 line: [ mouse.pos, mouse.pos_prev ]
				 });
         mouse.move = false;
      }
      mouse.pos_prev = {
				x: mouse.pos.x,
				y: mouse.pos.y
			};
      setTimeout(mainLoop, 25);
   }

   mainLoop();

	// var mouse = {
  //     click: false,
  //     move: false,
  //     pos: {x:0, y:0},
  //     pos_prev: false
  //  };
  //  // get canvas element and create context
  //  var canvas  = document.getElementById('drawing');
  //  var context = canvas.getContext('2d');
  // //  var width   = window.innerWidth;
  // //  var height  = window.innerHeight;
	//  var width   = $(window).width() - 400;
	//  console.log('CANVAS WIDTH:', width);
  //  var height  = window.innerHeight - 43;
	//  console.log('CANVAS HEIGHT:', height);
  //  var socket  = io.connect();
	//
  //  // set canvas to full browser width/height
  //  canvas.width = width;
  //  canvas.height = height;
	//
  //  // register mouse event handlers
  //  canvas.onmousedown = function(e){ mouse.click = true; };
  //  canvas.onmouseup = function(e){ mouse.click = false; };
	//
  //  canvas.onmousemove = function(e) {
  //     // normalize mouse position to range 0.0 - 1.0
  //     mouse.pos.x = e.clientX / width;
  //     mouse.pos.y = e.clientY / height;
  //     mouse.move = true;
  //  };
	//
  //  // draw line received from server
	// socket.on('draw_line', function (data) {
  //     var line = data.line;
  //     context.beginPath();
  //     context.moveTo(line[0].x * width, line[0].y * height);
  //     context.lineTo(line[1].x * width, line[1].y * height);
  //     context.stroke();
  //  });
	//
  //  // main loop, running every 25ms
  //  function mainLoop() {
  //     // check if the user is drawing
  //     if (mouse.click && mouse.move && mouse.pos_prev) {
  //        // send line to to the server
  //        socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
  //        mouse.move = false;
  //     }
  //     mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
  //     setTimeout(mainLoop, 25);
  //  }
  //  mainLoop();



	 // // This demo depends on the canvas element
 	// if(!('getContext' in document.createElement('canvas'))){
 	// 	alert('Sorry, it looks like your browser does not support canvas!');
 	// 	return false;
 	// }
 	//
 	// // The URL of your web server (the port is set in app.js)
 	// var url = 'http://localhost:3000';
 	//
 	// var doc = $(document),
 	// 	win = $(window),
 	// 	canvas = $('#paper'),
 	// 	ctx = canvas[0].getContext('2d'),
 	// 	instructions = $('#instructions');
 	//
 	// // Generate an unique ID
 	// var id = Math.round($.now()*Math.random());
 	//
 	// // A flag for drawing activity
 	// var drawing = false;
 	//
 	// var clients = {};
 	// var cursors = {};
 	//
 	// var socket = io.connect(url);
 	//
 	// socket.on('moving', function (data) {
 	//
 	// 	if(! (data.id in clients)){
 	// 		// a new user has come online. create a cursor for them
 	// 		cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
 	// 	}
 	//
 	// 	// Move the mouse pointer
 	// 	cursors[data.id].css({
 	// 		'left' : data.x,
 	// 		'top' : data.y
 	// 	});
 	//
 	// 	// Is the user drawing?
 	// 	if(data.drawing && clients[data.id]){
 	//
 	// 		// Draw a line on the canvas. clients[data.id] holds
 	// 		// the previous position of this user's mouse pointer
 	//
 	// 		drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
 	// 	}
 	//
 	// 	// Saving the current client state
 	// 	clients[data.id] = data;
 	// 	clients[data.id].updated = $.now();
 	// });
 	//
 	// var prev = {};
 	//
 	// canvas.on('mousedown',function(e){
 	// 	e.preventDefault();
 	// 	drawing = true;
 	// 	prev.x = e.pageX;
 	// 	prev.y = e.pageY;
 	//
 	// 	// Hide the instructions
 	// 	instructions.fadeOut();
 	// });
 	//
 	// doc.bind('mouseup mouseleave',function(){
 	// 	drawing = false;
 	// });
 	//
 	// var lastEmit = $.now();
 	//
 	// doc.on('mousemove',function(e){
 	// 	if($.now() - lastEmit > 30){
 	// 		socket.emit('mousemove',{
 	// 			'x': e.pageX,
 	// 			'y': e.pageY,
 	// 			'drawing': drawing,
 	// 			'id': id
 	// 		});
 	// 		lastEmit = $.now();
 	// 	}
 	//
 	// 	// Draw a line for the current user's movement, as it is
 	// 	// not received in the socket.on('moving') event above
 	//
 	// 	if(drawing){
 	//
 	// 		drawLine(prev.x, prev.y, e.pageX, e.pageY);
 	//
 	// 		prev.x = e.pageX;
 	// 		prev.y = e.pageY;
 	// 	}
 	// });
 	//
 	// // Remove inactive clients after 10 seconds of inactivity
 	// setInterval(function(){
 	//
 	// 	for(ident in clients){
 	// 		if($.now() - clients[ident].updated > 10000){
 	//
 	// 			// Last update was more than 10 seconds ago.
 	// 			// This user has probably closed the page
 	//
 	// 			cursors[ident].remove();
 	// 			delete clients[ident];
 	// 			delete cursors[ident];
 	// 		}
 	// 	}
 	//
 	// },10000);
 	//
 	// function drawLine(fromx, fromy, tox, toy){
 	// 	ctx.moveTo(fromx, fromy);
 	// 	ctx.lineTo(tox, toy);
 	// 	ctx.stroke();
 	// }

});
