//modules 
var express = require('express')
var app = require('express')()
var http = require('http')
var server = http.Server(app)
var io = require('socket.io')(server)
var fs = require('fs')
var client = io.of('/client')
var master = io.of('/master')
var lps = io.of('/lps')
var colors = require('colors/safe')
var uuid = require('node-uuid')
const TAG_NUMBER = 8
const ROOM_WIDTH = -30
const ROOM_LENGTH = -60
const SOUND_NUMBER = 3
const LPSfreq = 400
var user = {}
var tag = {}
var sound = {}
var config = {
    'TAG_NUMBER': TAG_NUMBER,
    'SOUND_NUMBER': SOUND_NUMBER,
    'ROOM_WIDTH': ROOM_WIDTH,
    'ROOM_LENGTH': ROOM_LENGTH,
}
colors.setTheme({
    server: ['cyan', 'bold'],
    master: ['green', 'bold'],
    lps: ['blue', 'bold'],
    client: ['magenta', 'bold'],
    error: 'red'
})
app.use(express.static(__dirname + '/static/css'))
app.use(express.static(__dirname + '/static/js'))
app.use(express.static(__dirname + '/static/img'))
app.use(express.static(__dirname + '/static/font'))
app.use(express.static(__dirname + '/static/sample'))
app.use(express.static(__dirname + '/static/obj'))
app.use(express.static(__dirname + '/static/lib'))
    //
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html')
})
app.get('/debug', function(req, res) {
    res.sendFile(__dirname + '/debug.html')
})
server.listen(4000, function() {
        console.log(colors.server('#server [listening : localhost:4000]'))
    })
    /*
       _|_|_|  _|        _|_|_|  _|_|_|_|  _|      _|  _|_|_|_|_|  
     _|        _|          _|    _|        _|_|    _|      _|      
     _|        _|          _|    _|_|_|    _|  _|  _|      _|      
     _|        _|          _|    _|        _|    _|_|      _|      
       _|_|_|  _|_|_|_|  _|_|_|  _|_|_|_|  _|      _|      _|      
    */
var active = new Map()
client.on('connection', function(socket) {
    console.log(colors.client('#client [connected]'))
    socket.emit('init', config)
    socket.on('requestSession', getUUID)
    socket.on('uploadSound', writeSound)
    socket.on('disconnect', disconnected)
})

function getUUID(id) {
    user[id] = uuid()
    active.set(this.id, user[id])
    client.emit('updateUser', user)
    client.emit('updateSound', sound)
    master.emit('updateUser', user)
    console.log(colors.client('#client [tag : ' + id + '] => [uuid : ' + user[id] + ']'))
}

function writeSound(data) {
    var id = data.id;
    if (user[id] && tag[id]) {
        fs.writeFile(__dirname + '/static/sample/' + user[id] + '.m4a', data.buffer, 'hex')
        if (sound[user[id]]) {
            client.emit('removeSound', user[id])
             console.log(colors.client('#client [override sound]'))
        } 
            sound[user[id]] = tag[id]
            client.emit('updateSound', sound)
        console.log(colors.client('#client [new sound]'))
    }
}

function disconnected() {
    for (var key in user) {
        if (user[key] === active.get(this.id)) {
            delete user[key]
            delete tag[key]
        }
        console.log(colors.client('#client [disconnected] [tag : ' + key + ']'))
    }
    client.emit('updateUser', user)
    master.emit('updateUser', user)
}
/*
 _|      _|    _|_|      _|_|_|  _|_|_|_|_|  _|_|_|_|  _|_|_|    
 _|_|  _|_|  _|    _|  _|            _|      _|        _|    _|  
 _|  _|  _|  _|_|_|_|    _|_|        _|      _|_|_|    _|_|_|    
 _|      _|  _|    _|        _|      _|      _|        _|    _|  
 _|      _|  _|    _|  _|_|_|        _|      _|_|_|_|  _|    _|  
*/
master.on('connection', function(socket) {
        socket.emit('init', config)
        console.log(colors.master('#master [connected]'))
        socket.on('disconnect', function() {
            console.log(colors.master('#master [disconnected]'))
        })
    })
    /*                        
     _|        _|_|_|      _|_|_|  
     _|        _|    _|  _|        
     _|        _|_|_|      _|_|    
     _|        _|              _|  
     _|_|_|_|  _|        _|_|_|    
    */
lps.on('connection', function(socket) {
        console.log(colors.lps('#lps    [connected]'))
        socket.on('sendPosition', function(data) {
            var position = {
                x: data.x,
                y: data.y,
                z: data.z,
                angle: data.angle
            }
            tag[data.id] = position
            client.emit('updateTag', tag)
            master.emit('updateTag', tag)
        })
        socket.on('disconnect', function() {});
    })
    //////////////////////////
var options = {
    host: '192.168.1.21',
    path: '/mdwui/lpsdemo_json.php',
    json: true
}

function getLPS() {
    var req = http.get(options, function(res) {
        var result = ''
        res.on('data', function(chunk) {
            result += chunk
        })
        res.on('end', function() {
            try {
                result = result.replace(/\0/g, '')
                var data = JSON.parse(result)
                parseLPS(data)
            } catch (e) {
                console.log(e)
            }
        })
    })
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message)
    })
}
for (var RA = []; RA.push([]) < TAG_NUMBER;) {}

function parseLPS(data) {
    for (var key in data) {
        var tagKey = key.replace('Anchor0', '')
        if (user[tagKey]) {
            var position = {
                x: data[key].location[1],
                y: data[key].location[0],
                z: data[key].location[2],
                angle: data[key].location[3]
            }
            RA[tagKey].push(position)
            if (RA[tagKey].length > 3) {
                RA[tagKey].shift()
                var av = average(RA[tagKey])
                position.x = av.x
                position.y = av.y
                position.angle = av.angle
            }
            tag[tagKey] = position
        }
    }
    client.emit('updateTag', tag)
    master.emit('updateTag', tag)
}

function average(arr) {
    var aX = 0
    var aY = 0
    var aA = 0
    for (var i = 0; i < arr.length; i++) {
        aX = aX + parseFloat(arr[i].x)
        aY = aY + parseFloat(arr[i].y)
        aA = aA + parseFloat(arr[i].angle)
    }
    aX = aX / arr.length
    aY = aY / arr.length
    aA = aA / arr.length
    return {
        x: aX,
        y: aY,
        angle: aA
    }
}
setInterval(function() {
        getLPS()
    }, LPSfreq)
    //var myFuncs = require('my-Funcs');
    //console.log(myFuncs(__dirname + '/static/js/map.js'));