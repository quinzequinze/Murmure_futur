var config
var inited = false
var initedMap = false
var initedUser = false
var initedSound = false
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
    if (initedMap) {
        drawTag()
    }
    if (initedUser) {
        drawUser()
    }

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
    updateManager()
    if (initedMap) {
        drawSound()
    }
    if (initedSound) {
        drawSoundList()
    }


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

function drawUser() {
    for (var key in display.user) {
        var d = document.getElementById(key)
        d.onclick = function(e) {
            masterMap.onclick = function(eb) {
                hideValidator()
            }
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
        if (tag[key]) {
            display.user[key].classList.remove('hidden')
            display.user[key].style.top = window.innerHeight / display.user.length * key + 'px'
            display.user[key].style.left = 20 + 'px'
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
            display.sound[key].id = key
            display.sound[key].classList.add('circle')
            display.sound[key].classList.add('sound')
            var z = {}
            z.x = sound[key].x * config.ROOM_WIDTH
            z.y = sound[key].y * config.ROOM_LENGTH

            display.sound[key].style.top = webUnit(z).y + 'px'
            display.sound[key].style.left = webUnit(z).x + 'px'
            if (sound[key].valid != false) {
                display.sound[key].style.backgroundImage = 'url("valid_sound.svg")';
            }
            masterMap.appendChild(display.sound[key])
        }
    }
}

function drawSoundList() {
    var masterMap = document.getElementById("masterMap")

    console.log(sound)

    for (var key in display.sound) {

        display.sound[key].parentNode.removeChild(display.sound[key])
    }
    var i = 0

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
            display.sound[key].classList.add('user')

            display.sound[key].style.top = (window.innerHeight / Object.keys(sound).length * i + 30) + 'px'
            display.sound[key].style.left = 20 + 'px'
            i = i + 1;

            masterMap.appendChild(display.sound[key])

            if (sound[key].valid != null) {
                display.sound[key].classList.add('hidden')
            }



        }
    }
}

function updateManager() {
    var manager = document.getElementById('manager')
    document.getElementById('id').textContent = manager.dataset.user
    document.getElementById('uuid').textContent = manager.dataset.uuid
    document.getElementById('hasSound').textContent = manager.dataset.hasSound
}

function initUser() {
    if (initedUser) return
    activateMasterMap("User")
    drawUser()
    initedUser = true
}

function initSound() {
    if (initedSound) return
    activateMasterMap("Sound")
    var progressbar = document.getElementById('seekbar');
    progressbar.classList.remove("hidden")
    drawSoundList()
    initedSound = true
}

function initMap() {
    if (initedMap) return
    activateMasterMap("Map")
    drawSound()
    initedMap = true
}

function init(_config) {
    if (inited) return
    config = _config
    var masterMap = document.getElementById("masterMap")
    var manager = document.getElementById("manager")
    var validator = document.getElementById("validator")
        // 
    display.user = []
    display.sound = []
    for (var i = 1; i <= config.TAG_NUMBER; i++) {
        display.user[i] = document.createElement("div")
        display.user[i].id = i
        display.user[i].classList.add('circle')
        display.user[i].classList.add('hidden')
        display.user[i].classList.add('user')

        
        masterMap.appendChild(display.user[i])
        display.user[i].textContent = i
    }

    var end = document.getElementById("end")
    end.onclick = function(e) {
        var data = {}
        data.UUID = manager.dataset.uuid
        data.id = manager.dataset.user
        socket.emit('endSession', data)
        hideValidator()
    }

    var reload = document.getElementById("reload")
    reload.onclick = function(e) {
        var data = {}
        data.UUID = manager.dataset.uuid
        data.id = manager.dataset.user
        socket.emit('reloadSession', data)
        hideValidator()
    }

    inited = true
}

function hideValidator() {
    validator.classList.add('hidden')
    manager.classList.add('hidden')
}

function activateMasterMap(_mode) {

    var masterSelector = document.getElementById("masterSelector")
    var previous = document.getElementById("previous")

    var d = document.createElement('div');
    d.id = 'mode';
    var modeText = document.createTextNode(_mode)
    d.appendChild(modeText)
    masterMap.appendChild(d);

    masterSelector.classList.add('hidden')
    masterMap.classList.remove('hidden')
    previous.classList.remove('hidden')

}

function getMasterSelector() {
    location.reload(true)
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
    if (player.duration) {
        progressbar.value = player.currentTime / player.duration
    }
    if (progressbar.value == 1) {
        var validator = document.getElementById("validator")
        validator.classList.remove('hidden')
        var yes = document.getElementById("yes")
        var no = document.getElementById("no")
        yes.onclick = function() {
            socket.emit('validate', player.dataset.sound)
            var valid = document.getElementById(player.dataset.sound)
            validator.classList.add('hidden')
            progressbar.value = 0
        }
        no.onclick = function() {
            socket.emit('invalidate', player.dataset.sound)
            validator.classList.add('hidden')
            progressbar.value = 0
        }
    }
}
//