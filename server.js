var config = {
        'TAG_NUMBER': 6,
        'SOUND_NUMBER': 6,
        'ROOM_WIDTH': 6.1, //grande longueur
        'ROOM_LENGTH': 4.5, //petite longueur
        'ORIENTATION_OFFSET': 48, //-42 + 90
    }
    //modules 
const express = require('express')
const app = require('express')()
const http = require('http')
const server = http.Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
const client = io.of('/client')
const master = io.of('/master')
const lps = io.of('/lps')
const colors = require('colors/safe')
const uuid = require('node-uuid')
const LPSfreq = 300
const raspberry = true
var active = new Map()
var active_tag_id = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
]
var db = require('origindb')(__dirname + '/static/db')
const persistence = true
    //var piIp = '192.168.1.21'
const piIp = '192.168.1.88'
var state = persistence ? queryState() : {}
var user = persistence ? queryUser() : {}
var sound = persistence ? querySound() : {}
var tag = {}
colors.setTheme({
    server: ['cyan', 'bold'],
    master: ['green', 'bold'],
    lps: ['blue', 'bold'],
    client: ['magenta', 'bold'],
    error: ['red', 'bold']
})
app.use(express.static(__dirname + '/static/css'))
app.use(express.static(__dirname + '/static/js'))
app.use(express.static(__dirname + '/static/img'))
app.use(express.static(__dirname + '/static/font'))
app.use(express.static(__dirname + '/static/lib'))
app.use(express.static(__dirname + '/static/video'))
app.use(express.static(__dirname + '/static/sound/sfx'))
app.use(express.static(__dirname + '/static/sound/sample'))
app.use(express.static(__dirname + '/static/sound/theme'))
app.use(express.static(__dirname + '/static/sound/year'))
app.use(express.static(__dirname + '/static/sound/debug'))
    //
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/laridme.html')
})
app.get('/debug', function(req, res) {
    res.sendFile(__dirname + '/debug.html')
})
app.get('/master', function(req, res) {
    res.sendFile(__dirname + '/master.html')
})
server.listen(4000, function() {
        console.log(colors.server('#server [listening : localhost:4000]'))
    })
    /*
     _|_|_|      _|_|    _|_|_|_|_|    _|_|    _|_|_|      _|_|      _|_|_|  _|_|_|_|  
     _|    _|  _|    _|      _|      _|    _|  _|    _|  _|    _|  _|        _|        
     _|    _|  _|_|_|_|      _|      _|_|_|_|  _|_|_|    _|_|_|_|    _|_|    _|_|_|    
     _|    _|  _|    _|      _|      _|    _|  _|    _|  _|    _|        _|  _|        
     _|_|_|    _|    _|      _|      _|    _|  _|_|_|    _|    _|  _|_|_|    _|_|_|_|  
    */
function querySound() {
    var s = {}
    var q = db('sound').keys()
    var i = q.length - 1
    while (Object.keys(s).length < config.SOUND_NUMBER && i >= 0) {
        var status = db('sound').get(q[i]).status
        if (status == "valid" || status == "pending") {
            s[q[i]] = db('sound').get(q[i])
        }
        i--
    }
    return s
}

function queryUser() {
    var u = {}
    for (var i = 1; i <= config.TAG_NUMBER; i++) {
        if (db('user').get(i) != 'undefined' && db('user').get(i) != null) {
            u[i] = db('user').get(i)
        }
    }
    master.emit('updateUser', u)
    client.emit('updateUser', u)
    return u
}

function queryState() {
    var s = {}
    for (var i = 0; i < active_tag_id.length; i++) {
        var t = active_tag_id[i].toString()
        if (typeof db('state').get(t) != 'undefined' && db('state').get(t) != null) {
            s[t] = db('state').get(t).toString()
            if (s[t] == 'undefined') {
                s[t] == 'wait'
            }
        }
    }
    return s
}
/*
   _|_|_|  _|        _|_|_|  _|_|_|_|  _|      _|  _|_|_|_|_|  
 _|        _|          _|    _|        _|_|    _|      _|      
 _|        _|          _|    _|_|_|    _|  _|  _|      _|      
 _|        _|          _|    _|        _|    _|_|      _|      
   _|_|_|  _|_|_|_|  _|_|_|  _|_|_|_|  _|      _|      _|      
*/
client.on('connection', function(socket) {
    console.log(colors.client('#client [connected]'))
    socket.emit('init', config)
    socket.on('uploadSound', writeSound)
    socket.on('identify', identify)
    socket.on('stateChange', stateChange)
    socket.on('choice', choice)
    socket.on('disconnect', disconnected)
})

function choice(_choice) {
    db('choice').set(user[_choice.id], {
        theme: _choice.theme,
        year: _choice.year
    })
    console.log(_choice)
}

function identify(id) {
    this.join(id)
    var p = {}
    if (user[id] != null) {
        console.log(colors.client('#client [has id]'))
        console.log(colors.client('#client [has state] ' + state[id]))
        client.to(id).emit('setState', state[id])
    } else {
        console.log(colors.client('#client [new guy]'))
        user[id] = uuid()
        if (persistence) {
            db('user').set(id, user[id])
        }
        client.to(id).emit('setState', 'wait')
        state[id] = 'wait'
    }
    active.set(this.id, user[id])
    client.emit('updateUser', user)
    master.emit('updateUser', user)
    client.emit('updateSound', sound)
    master.emit('updateSound', sound)
    console.log(colors.client('#client [tag : ' + id + '] => [uuid : ' + user[id] + ']'))
}

function stateChange(data) {
    if (persistence) {
        db('state').set(data.id, data.state)
    }
    state[data.id] = data.state
    master.emit("updateState", state)
}

function writeSound(data) {
    var id = data.id;
    if (user[id] && tag[id]) {
        fs.writeFile(__dirname + '/static/sound/sample/' + user[id] + '.m4a', data.buffer, 'hex')
        if (sound[user[id]]) {
            client.emit('removeSound', user[id])
            console.log(colors.client('#client [override sound]'))
        }
        sound[user[id]] = {
            x: tag[id].x / config.ROOM_WIDTH,
            y: tag[id].y / config.ROOM_LENGTH,
            z: 1.7
        }
        sound[user[id]].status = "pending"
            //
        console.log('now')
        soundHandler()
        client.emit('updateSound', sound)
        master.emit('updateSound', sound)
        console.log(colors.client('#client [new sound]'))
        if (persistence) {
            db('sound').set(user[id], tag[id])
            db('sound').set([user[id], 'time'], unixTime())
        }
    }
}

function soundHandler() {
    while (Object.keys(sound).length > config.SOUND_NUMBER) {
        console.log('remove')
        var k = oldestSound()
        console.log(k)
        delete sound[k]
    }
}

function oldestSound() {
    var age = null
    var oldest = {}
    for (var key in sound) {
        if (sound[key].time < age || age == null) {
            age = sound[key].time
            oldest = key
        }
    }
    return oldest
}

function disconnected() {
    for (var key in user) {
        if (user[key] === active.get(this.id)) {
            console.log(colors.client('#client [disconnected] [tag : ' + key + ']'))
        }
    }
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
    socket.emit('updateSound', sound)
    socket.emit('updateUser', user)
    socket.emit('updateState', state)
    console.log(colors.master('#master [connected]'))
    socket.on('disconnect', function() {
        console.log(colors.master('#master [disconnected]'))
    })
    socket.on('validate', validate)
    socket.on('invalidate', invalidate)
    socket.on('endSession', endSession)
    socket.on('reloadSession', reloadSession)
})

function validate(_UUID) {
    sound[_UUID].valid = true
    master.emit('updateSound', sound)
    if (persistence) {
        db('sound').set([_UUID, 'status'], 'valid')
    }
    console.log(colors.master('#master [validate][' + _UUID + ']'))
}

function invalidate(_UUID) {
    client.emit('removeSound', _UUID)
    client.emit('updateSound', sound)
    master.emit('updateSound', sound)
    delete sound[_UUID]
    if (persistence) {
        db('sound').set([_UUID, 'censored'], false)
    }
    console.log(colors.master('#master [censored][' + _UUID + ']'))
}

function endSession(data) {
    if (persistence) {
        db('user').set(data.id, null)
        db('state').set(data.id, 'wait')
    }
    state[data.id] = 'wait'
    delete user[data.id]
        //delete tag[key]
    client.to(data.id).emit('endSession')
    client.emit('updateUser', user)
    master.emit('updateUser', user)
    master.emit('updateState', state)
}

function reloadSession(data) {
    console.log(data)
    client.to(data.id).emit('reloadSession')
}
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
    host: piIp,
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
                console.log(colors.error('#error [parse pi data]'))
            }
        })
    })
    req.on('error', function(e) {
        console.log(colors.error('#error [request][pi is down]'))
    })
}
for (var RA = []; RA.push([]) < config.TAG_NUMBER;) {}

function parseLPS(data) {
    for (var key in data) {
        var tagKey = key.replace('Anchor0', '')
        var position = {
            x: data[key].location[1],
            y: data[key].location[0],
            z: data[key].location[2],
        }
        tag[tagKey] = position
    }
    client.emit('updateTag', tag)
    master.emit('updateTag', tag)
}

function unixTime() {
    return Math.round((new Date()).getTime() / 1000)
}
setInterval(function() {
    if (raspberry) {
        getLPS()
    }
}, LPSfreq)