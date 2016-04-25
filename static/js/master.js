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
    drawTag()
    drawUser()

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
    drawSound()


}


function init(_config) {
    if (inited) return
    config = _config
    var masterMap = document.getElementById("masterMap")
    var masterUser = document.getElementById("masterUser")

    var manager = document.getElementById("manager")
    var validator = document.getElementById("validator")
        // 
    display.user = []
    display.sound = []
    display.userMap = []
    display.soundMap = []
    for (var i = 1; i <= config.TAG_NUMBER; i++) {
        display.user[i] = document.createElement("div")
        display.userMap[i] = document.createElement("div")

        display.user[i].id = i
        display.user[i].classList.add('hidden')
        display.user[i].classList.add('userList')

        display.userMap[i].id = i
        display.userMap[i].classList.add('circle')
        display.userMap[i].classList.add('hidden')
        display.userMap[i].classList.add('user')

        masterMap.appendChild(display.userMap[i])
        masterUser.appendChild(display.user[i])

        display.userMap[i].textContent = i
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


function drawTag() {
    for (var key in display.user) {
        if (tag[key]) {
            display.userMap[key].classList.remove('hidden')
            display.userMap[key].style.top = webUnit(tag[key]).y + 'px'
            display.userMap[key].style.left = webUnit(tag[key]).x + 'px'
        } else {
            display.userMap[key].classList.add('hidden')
        }
        if (state[key] !== 'wait' && state[key]) {
            display.userMap[key].classList.add('active')
        } else {
            display.userMap[key].classList.remove('active')
        }
    }
}

function drawUser() {
    for (var key in display.user) {
        var d = display.user[key]
        d.onclick = function(e) {
            masterUser.onclick = function(eb) {
                hideValidator()
            }
            manager.classList.remove('hidden')
            manager.dataset.user = this.id
            manager.dataset.uuid = user[this.id]
            console.log(manager.dataset.user)
            if (sound[user[this.id]] && sound[user[this.id]].valid) {
                manager.dataset.hasSound = true
            } else {
                manager.dataset.hasSound = false
            }
            updateManager()
            e.stopPropagation()
        }
        if (sound[user[key]] && sound[user[key]].valid) {
            display.user[key].textContent = "Id: " + key + " HasSound: True"
        }else{
            display.user[key].textContent = "Id: " + key + " HasSound: False"
        }
        
        if (tag[key]) {
            display.user[key].classList.remove('hidden')
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
    var masterSound = document.getElementById("masterSound")

    for (var key in display.soundMap) {
        display.soundMap[key].parentNode.removeChild(display.soundMap[key]);
    }
    for (var key in display.sound) {
        display.sound[key].parentNode.removeChild(display.sound[key]);
    }

    var i = 0

    for (var key in sound) {
        if (!document.getElementById(key)) {
            display.soundMap[key] = document.createElement("div")
            display.soundMap[key].id = key
            display.soundMap[key].classList.add('circle')
            display.soundMap[key].classList.add('sound')
            var z = {}
            z.x = sound[key].x * config.ROOM_WIDTH
            z.y = sound[key].y * config.ROOM_LENGTH

            display.soundMap[key].style.top = webUnit(z).y + 'px'
            display.soundMap[key].style.left = webUnit(z).x + 'px'
            if (sound[key].valid != false) {
                display.soundMap[key].style.backgroundImage = 'url("valid_sound.svg")';
            }
            masterMap.appendChild(display.soundMap[key])


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
            display.sound[key].classList.add('soundList')

            display.sound[key].textContent = key
            if (sound[key].valid != false) {
                display.soundMap[key].style.backgroundImage = 'url("valid_sound.svg")';
            }

            if (sound[key].valid != null) {
                display.sound[key].classList.add('hidden')
            }

            masterSound.appendChild(display.sound[key])
        }
    }
}

function updateManager() {
    var manager = document.getElementById('manager')
    document.getElementById('id').textContent = manager.dataset.user
    document.getElementById('uuid').textContent = manager.dataset.uuid
    document.getElementById('hasSound').textContent = manager.dataset.hasSound
}

function showUser() {
    var masterUser = document.getElementById("masterUser")
    var masterSound = document.getElementById("masterSound")
    var masterMap = document.getElementById("masterMap")

    masterUser.classList.remove('hidden')
    masterSound.classList.add('hidden')
    masterMap.classList.add('hidden')

}

function showSound() {
    var masterUser = document.getElementById("masterUser")
    var masterSound = document.getElementById("masterSound")
    var masterMap = document.getElementById("masterMap")

    masterUser.classList.add('hidden')
    masterSound.classList.remove('hidden')
    masterMap.classList.add('hidden')
}


function showMap() {
    var masterUser = document.getElementById("masterUser")
    var masterSound = document.getElementById("masterSound")
    var masterMap = document.getElementById("masterMap")

    masterUser.classList.add('hidden')
    masterSound.classList.add('hidden')
    masterMap.classList.remove('hidden')

}


function hideValidator() {
    validator.classList.add('hidden')
    manager.classList.add('hidden')
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