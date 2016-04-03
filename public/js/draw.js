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
   var height  = $(window).height() - 46;
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
      var line = data.line;
			// console.log('draw-line', line);
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

});

function clearArea() {
  // Use the identity matrix while clearing the canvasas
  context.setTransform(1, 0, 0, 1, 0, 0);
  // context.clearRect(0, 0, context.canvasas.width, context.canvasas.height);
	context.clearRect(0, 0, canvas.width, canvas.height);
}
