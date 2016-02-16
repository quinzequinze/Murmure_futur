var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var pouchDB = require('pouchdb');

// var open = require('open');


app.use(express.static(__dirname + '/static/css'));
app.use(express.static(__dirname + '/static/js'));
app.use(express.static(__dirname + '/static/img'));
app.use(express.static(__dirname + '/static/fonts'));
app.use(express.static(__dirname + '/static/samples'));
app.use(express.static(__dirname + '/static/obj'));

//var db = new pouchDB(__dirname + '/moutons');


var users = new Object();
var sounds = new Object();

var connectCounter = 0;

var numberOfTags = 10;
var nbSounds = 0;

var config = {
  render: true,
  nbUserServer: numberOfTags,
  roomWidth: -30,
  roomLength: -60,
  nbSoundMax: 40,
};


for (var i = 1; i <= numberOfTags; i++) {
  var user = {
    "_id": String(i), //Key for pouchDB, need to be a string
    "id": i,
    "x": 0,
    "y": 0,
    "z": 0,
    "dt": 0,
    "angle": 0,
    "isConnected": false,
    "isTagConnected": false
  };


  users[user.id] = user;

  delete user;
};

function initPouchDBObjects() {
  var temp = {};

  temp._id = "users";
  temp.users = users;

  db.put(temp).then(function(response) {
    // handle response
  }).catch(function(err) {
    console.log(err);
  });

  temp._id = "sounds";
  temp.sounds = sounds;

  db.put(temp).then(function(response) {
    // handle response
  }).catch(function(err) {
    console.log(err);
  });
}



function randomInt(_min, _max) {
  return _min + Math.floor(Math.random() * (_max - _min + 1));
}

//This routine is responsible for avoid to number of sound on the scene to go 
//over the nbSoundMax variable
//If the number max of sound is over the limit the oldest sound is removed
function soundsHandler(_table) {
  nbSounds = nbSounds + 1;
  io.emit('updateSoundNb', nbSounds);
  console.log(Object.keys(_table).length);
  if (Object.keys(_table).length > config.nbSoundMax) {
    for (var i in _table) {
      io.emit('removeSound', i);
      delete _table[i]
      return;
    };

  };
  return;
}

var i = 0;

function uploadUsersInDB() {
  // fetch users
  db.get('users').then(function(doc) {
    // update their age

    doc.users = users;
    // put them back
    return db.put(doc);
  });

  return;
}

function uploadSoundsInDB() {
  // fetch users
  db.get('sounds').then(function(doc) {
    // update their age

    doc.sounds = sounds;
    // put them back
    return db.put(doc);
  });

  return;
}

function getSoundsFromDB() {
  // fetch users
  db.get('sounds').then(function(doc) {
    // update their age
    sounds = doc.sounds;
    // put them back
    return;
  });

  return;
}

//getSoundsFromDB();
// setInterval(uploadUsersInDB, 3000);

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

// process.once('SIGUSR2', function() {
//   io.emit("closeClient");
//   process.kill(process.pid, 'SIGUSR2');
// });

//////////////////////////HANDLERS
app.get('/', function(req, res) {  
  res.sendfile(__dirname + '/client/player.html');
  console.log("reload | id : "+req.param('id'));
  //le param est passé dans l'url ->/?id=1
});

app.get('/record', function(req, res) {
  res.sendfile(__dirname + '/recorder/recorder.html');
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

  socket.on('getSoundNb', function(msg) {
    io.emit("updateSoundNb", nbSounds);
  });


  socket.on('sendUsers', function(table, index) {
    users[index] = table[index];
    io.emit("emitUsers", users);
  });

  socket.on('sendNewSound', function(table, index) {

    sounds[index] = table;
    soundsHandler(sounds);
    uploadSoundsInDB();
    console.log(sounds);
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

http.listen(4000, function() {
  console.log('listening on *:4000');
});