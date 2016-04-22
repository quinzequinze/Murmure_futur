//http://patorjk.com/software/taag/#p=display&v=0&f=Block&t=SOMETHING`
//constantes
const root = 'vigo.local:4000'
    //globals
var TAG_ID = TAG_ID || 0;
var battery, init, config
var user = {}
var inited = false
var tag = {}
var sound = {}
var canRecord = false
var logicItems = {}
    //modules 
var audio = instal.audio()
var map = instal.map()
var theme = instal.theme()
var deviceOrientation = instal.deviceOrientation()
    //var ui = instal.ui()
var socket = io.connect(root + '/client')
    //socket events
socket.on('init', init)
socket.on('updateUser', updateUser)
socket.on('updateTag', updateTag)
socket.on('updateSound', updateSound)
socket.on('removeSound', removeSound)
socket.on('endSession', endSession)
socket.on('setState', setState)
    //
if (getMobileOperatingSystem() === 'iOS') {
    setInterval(function() {
        updateBattery();
    }, 5000)
}

function endSession() {
    reset()
    socket.emit('identify', TAG_ID)
}

function starter() {
    document.body.removeEventListener("mousedown", starter, false)
    document.body.removeEventListener("touchstart", starter, false)
    state.toIntroduction()
}

function setState(_state) {
    switch (_state) {
        case "wait":
            state.toWait()
            break;
        case "exploration":
            state.toExploration()
            break;
        case "theme":
            state.toTheme()
            break;
        case "introduction":
            state.toIntroduction()
            break;
                    case "year":
            state.toYear()
            break;
    }
}

function init(_data) {
    socket.emit('identify', TAG_ID)
    if (inited) return
    config = _data
    deviceOrientation.setOffset(config.ORIENTATION_OFFSET)
    if (map) {
        map.init()
    }
    inited = true

}

function updateBattery() {
    window.webkit.messageHandlers.scriptMessageHandler.postMessage('getBattery')
        //socket.emit('updateBattery', TAG_ID)
}

function updateTag(_tag) {
    tag = _tag
    if (typeof tag[TAG_ID] !== 'undefined') {
        audio.listener.setPosition(tag[TAG_ID].x, tag[TAG_ID].y, tag[TAG_ID].z)
    }
    if (map) {
        map.drawTag(_tag)
    }
}

function updateUser(_user) {
    user = _user
}

function setOrientation(_angles) {
    if (typeof tag[TAG_ID] !== 'undefined') {
        tag[TAG_ID].angle = _angles.alpha
    }
}

function updateSound(_sound) {
    sound = _sound
        //load sound if necessary
    for (var key in sound) {
        if (!audio.sample.hasOwnProperty(key)) {
            audio.sample[key] = audio.loadSound3D(key + '.m4a', true)
            audio.sample[key].panner.setPosition(sound[key].x, sound[key].y, sound[key].z)
        }
    }
    //remove sound that should not be there anymore
    for (var key in audio.sample) {
        if (!sound.hasOwnProperty(key)) {
            audio.sample[key].randomLooping = false
            audio.sample[key].source.disconnect()
            delete audio.sample[key]
        }
    }
    if (map) {
        map.drawSound()
    }
}
//replace sound in case of re-recording
function removeSound(_data) {
    clearTimeout(audio.sample[_data].timeOut)
    audio.sample[_data].source.disconnect()
    delete audio.sample[_data]
}
//upload sound to the server => trigered by the app
function uploadSound(_buffer) {
    var d = {}
    d.buffer = _buffer.toString().replace(/\s+/g, '').substr(10, _buffer.length - 12)
    d.id = TAG_ID.toString()
    socket.emit('uploadSound', d)
}
//If a problem occured during the reccording => trigered by the app
function recordingFail() {
    console.log('recording too short')
}
//returns closest tag id / distance (in m)
function closestTag() {
    var t = {}
    for (var key in tag) {
        if (key != TAG_ID) {
            var distance = dist(tag[TAG_ID].x, tag[TAG_ID].y, tag[key].x, tag[key].y)
            if (distance < t.dist || typeof t.dist == 'undefined') {
                t.dist = distance
                t.id = key
            }
        }
    }
    return t
}
//returns closest sound id / distance (in m)
function closestSound() {
    var s = {}
    for (var key in sound) {
        if (typeof tag[TAG_ID] !== 'undefined') {
            var distance = dist(tag[TAG_ID].x, tag[TAG_ID].y, sound[key].x, sound[key].y)
            if (distance < s.dist || typeof s.dist == 'undefined') {
                s.dist = distance
                s.id = key
            }
        }
    }
    return s
}
///////////////////////
;
(function logicLoop() {
    if (deviceOrientation.angles.alpha) {
        audio.listener.setOrientation(Math.cos(radians(deviceOrientation.angles.alpha)), 0, Math.sin(radians(deviceOrientation.angles.alpha)), 0, 1, 0);
    }
    for (key in logicItems) {
        logicItems[key]()
    }
    requestAnimationFrame(logicLoop);
})();

function reset() {
    user = {}
    tag = {}
    sound = {}
    for (var key in audio.sfx) {
        if (audio.sfx[key].source) {
            audio.sfx[key].source.disconnect()
        }
        clearTimeout(audio.sfx[key].timeOut)
    }
    audio.sfx = {}
    disallowRecording()
    state.toWait()
    audio.fadeOut(0.5)
}