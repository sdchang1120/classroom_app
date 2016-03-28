$(function() {

  var socket = io();

  socket.on('boioing', function(msg) {
    console.log('Message from the server: ', msg);
  });

  $('select').change(function(){
    var url = $(this).val();
		// console.log(url);
		// redirect to url
    window.location = url;
	});

})
