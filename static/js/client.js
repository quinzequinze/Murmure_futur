//todo canIhasSession ? / tagid iphone / page d'aceuil ? -> ? is master ?
var instal = instal || {}
instal.client = (function(window, undefined) {
    function client() {
        var sounds = []
        var users = []
        var session;
        var socket = io.connect('vigo.local:4000/client')
        socket.on('newConfig', newConfig)
        socket.on('newSession', newSession)
        socket.on('newSound', newSound)
        socket.on('initUsers', initUsers)
        socket.on('initSounds', initSounds)
        socket.on('updateUsers', updateUsers)

        function newConfig(data) {
            config = data
            socket.emit('requestSession', TAG_ID)
            console.log(data)
        }

        function newSession(data) {
            session = data
            console.log(data)
        }

        function newSound(data) {
            console.log("client | new sound")
        }

        function updateUsers(data) {
            users=data
           // console.log(data)
        }

        function initSounds(data) {
            console.log(data)
        }

        function bind(_extentions) {
            var c = socket._callbacks
            for (var l in c) {
                if (_extentions[l]) {
                    c[l][0] = c[l][0].extend(_extentions[l])
                }
            }
            return this
        }

        function initUsers(data) {
            console.log("initUsers | client")
        }

        function uploadSound(data) {
            if (session) {
                var d = {}
                d.buffer = data.toString().replace(/\s+/g, '').substr(10, data.length - 12)
                d.session = session + '.m4a'
                d.id = TAG_ID.toString()
                socket.emit('uploadSound', d)
            }
        }
        return {
            sounds: sounds,
            users: users,
            config: config,
            bind: bind,
            uploadSound: uploadSound,
        }
    }
    return client
})(window)