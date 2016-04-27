//http://patorjk.com/software/taag/#p=display&v=0&f=Block&t=SOMETHING`
//constantes
//globals
var config
var user = {}
var inited = false
var tag = {}
var sound = {}
    //modules 
var audio = instal.audio()
var ui = instal.ui()
var map = instal.map()
var socket = io.connect(root + '/client')
    //socket events
socket.on('init', init)
socket.on('updateUser', updateUser)
socket.on('updateTag', updateTag)
socket.on('updateSound', updateSound)

function init(_data) {
    if (inited) return
    config = _data
    if (typeof map !== 'undefined') {
        map.init()
    }
    inited = true
}


function updateTag(_tag) {
    tag = _tag
    if (typeof map !== 'undefined') {
        map.drawTag(_tag)
    }
}

function updateUser(_user) {
    user = _user
}

function updateSound(_sound) {
    sound = _sound
    if (typeof map !== 'undefined') {
        map.drawSound()
    }
}