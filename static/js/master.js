//bypass for debug
var instal = instal || {};
instal.master = (function(window, undefined) {
    var status = []
    function master() {
        var socket = io.connect('vigo.local:4000/master')
        socket.on('updateUsers', updateUsers)
        socket.on('requestSession', resquestSession)
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//                                                                                   //
//                                                                                   // 
///////////////////////////////////////////////////////////////////////////////////////
function updateUsers(data){
console.log(data);
}
        function resquestSession(data) {
            console.log("master | tag #" + data + " pending...")
        }

        function initSounds(data) {
            console.log("initSounds | master")
        }
        return {
            initSounds: initSounds,
        }
    }
    return master;
})(window);