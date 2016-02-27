//bypass for debug
var instal = instal || {};
instal.lps = (function(window, undefined) {
    var status = []
    function lps() {
        var socket = io.connect('vigo.local:4000/lps')
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
//                                                                                   //
//                                                                                   // 
///////////////////////////////////////////////////////////////////////////////////////
function updateUsers(data){
}
        function sendPosition(data) {
        
        var position = []
        position[TAG_ID] = {
            "x":data.x,
            "y":data.y,
            "z":data.z,
            "angle":data.angle
          }
            socket.emit("sendPosition", position)
        }

        function initSounds(data) {
        }
        return {
sendPosition:sendPosition
        }
    }
    return lps;
})(window);