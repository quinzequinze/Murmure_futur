var config
var user = {}
var tag = {}
var state = {}
var inited = false
var socket = io.connect(root + '/master')
var elem = document.getElementById('box')
var map = instal.map(elem)
    //
socket.on('init', init)
socket.on('updateUser', updateUser)
socket.on('updateTag', updateTag)
    //
function updateTag(_tag) {
    tag = _tag
    map.drawTag()
    
}

function updateUser(_user) {
    user = _user
    map.drawTag()

}

function init(_config) {
    if (inited) return
    config = _config
    inited = true
    map.init()
}

