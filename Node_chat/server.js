var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var THREE = require('three');

app.use(express.static('public'));

// Root
app.get('/', function(req, res){
  // show index.html
  res.sendFile(__dirname + '/index.html');
});

// app.get('/step1', function(req, res){
//   // show step1.html
//   res.sendFile(__dirname + '/step1.html');
// });

// app.get('/:userId', function(req, res){
//   console.log(req.params.userId);    
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){ 
  console.log('user connected', socket.id);

  socket.on('chat message', function(msg){
    console.log('new chat message');
    
    io.emit('chat message', msg);
  });
});

// Launch server
server.listen(3000, function(){
  console.log('listening on *:3000');
});
