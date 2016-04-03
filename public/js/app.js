$(function() {

  var $menu = $('#menu');
  var $menulink = $('.menu-link');

  $menulink.click(function() {
    // $menulink.toggleClass('active');
    $menu.slideToggle(700);
    return false;
  });

  // var socket = io();
  //
  // socket.on('boioing', function(msg) {
  //   console.log('Message from the server: ', msg);
  // });

  $('#select-user').change(function(){
    var url = $(this).val();
		// console.log(url);
		// redirect to url
    window.location = url;
	});

  // input hover effect
  $('input').hover(function() {
    $(this).css('border-color', '#09B2E9');
  }, function() {
    $(this).css('border-color', '#eaeaea');
  });

  $('.controls').hover(function() {
    $('.toolbox').css('display', 'inline-block')
  }, function() {
    $('.toolbox').css('display', 'none')
  })

})
