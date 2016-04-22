var config
var inited = false
var user = {}
var tag = {}
var state = {}
var sound = {}
var audio = instal.audio()
var display = {}
    //
var socket = io.connect(root + '/master')
    //
socket.on('init', init)
socket.on('updateSound', updateSound)
socket.on('updateUser', updateUser)
socket.on('updateTag', updateTag)
socket.on('updateState', updateState)
    //
function updateTag(_tag) {
    tag = _tag
    drawTag()
}

function updateState(_state) {
    state = _state
}

function updateUser(_user) {
    user = _user
    updateManager()
}

function updateSound(_sound) {
    sound = _sound
    drawSound()
    updateManager()
}

function drawTag() {
    for (var key in display.user) {
        if (tag[key]) {
            display.user[key].classList.remove('hidden')
            display.user[key].style.top = webUnit(tag[key]).y + 'px'
            display.user[key].style.left = webUnit(tag[key]).x + 'px'
        } else {
            display.user[key].classList.add('hidden')
        }
        if (state[key] !== 'wait' && state[key]) {
            display.user[key].classList.add('active')
        } else {
            display.user[key].classList.remove('active')
        }
    }
}

function drawSound() {
    var masterMap = document.getElementById("masterMap")
    for (var key in display.sound) {
        display.sound[key].parentNode.removeChild(display.sound[key]);
    }
    for (var key in sound) {
        if (!document.getElementById(key)) {
            display.sound[key] = document.createElement("div")
            display.sound[key].onmousedown = function(e) {
                e.stopPropagation()
                var player = document.getElementById("player")
                var validator = document.getElementById("validator")
                validator.classList.add('hidden')
                player.src = this.id + '.m4a'
                player.dataset.sound = this.id
                player.play()
            }
            display.sound[key].id = key
            display.sound[key].classList.add('circle')
            display.sound[key].classList.add('sound')
            display.sound[key].style.top = webUnit(sound[key]).y + 'px'
            display.sound[key].style.left = webUnit(sound[key]).x + 'px'
            if (sound[key].valid == true) {
                display.sound[key].style.backgroundImage = 'url("valid_sound.svg")';
            }
            masterMap.appendChild(display.sound[key])
        }
    }
}

function updateManager() {
    var manager = document.getElementById('manager')
    document.getElementById('id').textContent = manager.dataset.user
    document.getElementById('uuid').textContent = manager.dataset.uuid
    document.getElementById('hasSound').textContent = manager.dataset.hasSound
}

function init(_config) {
    if (inited) return
    var masterMap = document.getElementById("masterMap")
    var manager = document.getElementById("manager")
    var validator = document.getElementById("validator")
    config = _config
    display.user = []
    display.sound = []
    for (var i = 1; i <= config.TAG_NUMBER; i++) {
        display.user[i] = document.createElement("div")
        display.user[i].id = i
        display.user[i].classList.add('circle')
        display.user[i].classList.add('hidden')
        display.user[i].classList.add('user')
        display.user[i].onclick = function(e) {
            manager.classList.remove('hidden')

            manager.dataset.user = this.id
            manager.dataset.uuid = user[this.id]
               console.log(manager.dataset.user)
            if (sound[user[this.id]]) {
                manager.dataset.hasSound = true
            } else {
                manager.dataset.hasSound = false
            }
            updateManager()
            e.stopPropagation()
        }
        masterMap.appendChild(display.user[i])
        display.user[i].textContent = i
    }
    document.body.onclick = function(e) {
        validator.classList.add('hidden')
        manager.classList.add('hidden')
        e.stopPropagation()
    }
    var end = document.getElementById("end")
    end.onclick = function(e) {
        var data = {}
        data.UUID = manager.dataset.uuid
        data.id = manager.dataset.user
        socket.emit('endSession', data)
    }
    inited = true
}

function webUnit(_tag) {
    var masterMap = document.getElementById("masterMap")
    return {
        x: _tag.x * masterMap.offsetWidth / config.ROOM_WIDTH,
        y: _tag.y * masterMap.offsetHeight / config.ROOM_LENGTH,
        z: 170,
        angle: _tag.angle
    }
}

function udpateProgress() {
    var player = document.getElementById('player');
    var progressbar = document.getElementById('seekbar');
    progressbar.value = player.currentTime / player.duration
    if (progressbar.value == 1) {
        var validator = document.getElementById("validator")
        validator.classList.remove('hidden')
        var yes = document.getElementById("yes")
        var no = document.getElementById("no")
        yes.onclick = function() {
            socket.emit('validate', player.dataset.sound)
            var valid = document.getElementById(player.dataset.sound)
            validator.classList.add('hidden')
        }
        no.onclick = function() {
            socket.emit('invalidate', player.dataset.sound)
            validator.classList.add('hidden')
        }
    }
}
//