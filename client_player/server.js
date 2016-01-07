var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
// var open = require('open');


app.use(express.static(__dirname + '/static/css'));
app.use(express.static(__dirname + '/static/js'));
app.use(express.static(__dirname + '/static/img'));
app.use(express.static(__dirname + '/static/fonts'));
app.use(express.static(__dirname + '/static/samples'));

var users = new Object();
var sounds = new Object();

var connectCounter = 0;

var numberOfTags = 10;

var config = {
  render: true,
  nbUserServer: numberOfTags,
  roomWidth: 30,
  roomLength: 50,
};


for (var i = 1; i <= numberOfTags; i++) {
  var user = {
    "id": "x",
    "x": 0,
    "y": 0,
    "z": 0,
    "dt": 0,
    "angle": 0,
    "isConnected": false,
    "isTagConnected": false
  };

  user.id = i;
  users[user.id] = user;

  delete user;
};

console.log(users);

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}



//////////////////////////AUTO RELOAD
//In the terminal run cd */client_player where * is the root directory of the project
//Open the server with the following command "nodemon server.js"
//This will trigger a restart of the server on any file change in the project, avoid 
//using ctrl+c and refresh of the client 
// 
//Force opening of clients from the server, do not open manually from the browser
//or the window.close() routine will not work on the client side
// open('http://localhost:3000/');
// open('http://localhost:3000/');

process.once('SIGUSR2', function() {
  io.emit("closeClient");
  process.kill(process.pid, 'SIGUSR2');
});

//////////////////////////HANDLERS
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/etsi_player.html');
  console.log("reload")
    // res.sendfile('idSelec.html');
});

app.get('/record', function(req, res) {
  res.sendfile(__dirname + '/etsi_recorder.html');
  // res.sendfile('idSelec.html');
});

io.on('connection', function(socket) {
  connectCounter++;
  console.log("connection: " + connectCounter);
  socket.emit('newClient', config);

  socket.on('getListener', function(index) {
    io.emit("startListener", index);
    console.log("startListener: " + index);
  });

  socket.on('getUsers', function(msg) {
    io.emit("emitUsers", users);
  });

  socket.on('getSounds', function(msg) {
    io.emit("emitSounds", sounds);
  });

  socket.on('sendUsers', function(table, index) {
    users[index] = table[index];
    io.emit("emitUsers", users);
  });

  socket.on('sendNewSound', function(table, index) {
    sounds[index] = table[index];
    io.emit("emitSounds", sounds);
  });

  socket.on('sendRemoveSound', function(table) {
    sounds = table;
    io.emit("emitSounds", sounds);
  });

  socket.on('disconnect', function(socket) {
    connectCounter--;

    console.log("disconnect: " + socket);

  });

});



http.listen(3000, function() {
  console.log('listening on *:3000' + __dirname);
});