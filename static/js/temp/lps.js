//bypass for debug
var instal = instal || {};
instal.lps = (function(window, undefined) {
    function lps() {
        var socket = io.connect('vigo.local:4000/lps')

        function sendPosition(data) {
            var position = {
                    "id": TAG_ID,
                    "x": data.x,
                    "y": data.y,
                    "z": data.z,
                    "angle": data.angle
                }
            socket.emit("sendPosition", position)
        }
        return {
            sendPosition: sendPosition
        }
    }
    return lps;
})(window);