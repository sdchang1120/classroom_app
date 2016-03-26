var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;



app.listen(port, function() {
  console.log('=========================');
  console.log('listening on port:', port);
  console.log('=========================');
});
