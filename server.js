//modules 
var express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var fs = require('fs')
var client = io.of('/client')
var master = io.of('/master')
var lps = io.of('/lps')
var pouchDB = require('pouchdb')
var colors = require('colors/safe')
var low = require('lowdb')
var storage = require('lowdb/file-sync')
var db = low(__dirname + '/laridme.json', storage)
var uuid = require('node-uuid')
//var user = db('users').find({ name: 'typicode' })
//var UUID = uuid();
//db('session').push({uuid:UUID})
//varantes
const TAG_NUMBER = 8
const ROOM_WIDTH = -30
const ROOM_LENGTH = -60
const SOUND_NUMBER = 3
var users = []
var tags = []
var sounds = []
var config = {
    "TAG_NUMBER": TAG_NUMBER,
    "SOUND_NUMBER": SOUND_NUMBER,
    "ROOM_WIDTH": ROOM_WIDTH,
    "ROOM_LENGTH": ROOM_LENGTH,
}
colors.setTheme({
    server: ['cyan', 'bold'],
    client: ['yellow', 'bold'],
    error: 'red'
})
app.use(express.static(__dirname + '/static/css'))
app.use(express.static(__dirname + '/static/js'))
app.use(express.static(__dirname + '/static/img'))
app.use(express.static(__dirname + '/static/font'))
app.use(express.static(__dirname + '/static/sample'))
app.use(express.static(__dirname + '/static/obj'))
app.use(express.static(__dirname + '/static/lib'))
init()


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html')
})
http.listen(4000, function() {
    console.log(colors.server('#server [listening] localhost:4000'))
});
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//                                                                                   //
//                                                                                   // 
///////////////////////////////////////////////////////////////////////////////////////
client.on('connection', function(socket) {
    console.log(colors.server("#server [new client] " + io.sockets.sockets.length + "/" + TAG_NUMBER))
    socket.emit('newConfig', config)
    socket.on('requestSession', function(data) {
        console.log(data)
        tags[data] = {}
        tags[data].session = uuid()
            //push -> session bd
        socket.emit('newSession', tags[data].session)
        socket.emit('initSounds', sounds)
        console.log(colors.server('#server new session [' + tags[data].session + ']'))
    })
    socket.on('uploadSound', function(data) {
        fs.writeFile(__dirname + '/static/sample/' + data.session, data.buffer, 'hex', function(err) {
                if (err) throw err
            })
            //sound -> push
        var id = data.id;
        var newSound = {}
        newSound.session = tags[id].session
                if(tags[id].position){
        newSound.position = tags[id].position
}else{

  newSound.position = {'x':0,'y':0,'z':0}
//change bizard
  }  

        sounds.push(newSound)
        while (sounds.length > SOUND_NUMBER) {
            sounds.shift()
        }
        console.log(sounds)
            //client.emit("newSound",sounds)
            //        console.log(sounds)
        console.log(colors.client("#client new sound"))
    })
    socket.on('disconnect', function(socket) {
        console.log(colors.client("#client disconnected"))
    })
});
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//                                                                                   //
//                                                                                   // 
///////////////////////////////////////////////////////////////////////////////////////
master.on('connection', function(socket) {
    console.log(colors.server("#server [new master]"))
    socket.on('disconnect', function(socket) {})
});
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//                                                                                   //
//                                                                                   // 
///////////////////////////////////////////////////////////////////////////////////////
lps.on('connection', function(socket) {
    console.log(colors.server("#server [new lps]"))
    socket.on('sendPosition', function(data) {
               // console.log(data)
        for (var i in data) {
            if (data[i]) {
                tags[data[i].id].position = {
                        x: data[i].x,
                        y: data[i].y,
                        z: data[i].z,
                        angle: data[i].angle
                    }
                    // console.log(data[i])
                    // console.log(tags)
            }
        }

        client.emit("updateUsers", tags)
    });
    socket.on('disconnect', function(socket) {});
});
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//                                                                                   //
//                                                                                   // 
///////////////////////////////////////////////////////////////////////////////////////
function getSession() {
    var status = 1;
    return status
}

function updateSession() {
    master.emit('updateUsers', users)
}

function getLastSound() {
    //query = sounds from right WHERE sounds.path!=null 
    var status;
    return status
}

function init() {
    //chercher dans la base de donnée les valeurs
}
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//                                                                                   //
//                                                                                   // 
///////////////////////////////////////////////////////////////////////////////////////
/*
function soundsHandler(_table) {
    nbSounds = nbSounds + 1
    io.emit('updateSoundNb', nbSounds)
    console.log(Object.keys(_table).length)
    if (Object.keys(_table).length > config.nbSoundMax) {
        for (var i in _table) {
            io.emit('removeSound', i)
            delete _table[i]
            return
        }
    }
    return
}
*/
//var uuid = uuid() 
/*
        db('session').push({uuid:UUID})
        var s = db('session').find({uuid:'style'})
        s.name = data
        s.tag = 'unmp3.mp3'
        console.log(s);
        }
*/
//users[data].socket = this
//users[data].connected = true
// socket.emit('initUsers', tags)
/*
1 - user request session, [tag] -> server [tag] status = ready -> to master [tag]
2 - from master enable session [uuid][tag]  -> to server -> [tagId][uuid] -> to db

-> session ? ready ? undefined ? active
-> moderation enregistrement (on écouter pas ecouter)                                            
-> event docling station -> close session
oui / non / trop court /  
*/