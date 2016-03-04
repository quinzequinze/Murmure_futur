//bypass for debug
var instal = instal || {};
instal.lps = (function(window, undefined) {
    var status = []

    function lps() {
        var socket = io.connect('vigo.local:4000/lps')
        var position = []
            ///////////////////////////////////////////////////////////////////////////////////////
            //                                                                                   //
            //                                                                                   //
            //                                                                                   // 
            ///////////////////////////////////////////////////////////////////////////////////////
        function updateUsers(data) {}

        function sendPosition(data) {
            position[TAG_ID] = {
                    "id": TAG_ID,
                    "x": data.x,
                    "y": data.y,
                    "z": data.z,
                    "angle": data.angle
                }
                // console.log(position)
            socket.emit("sendPosition", position)
        }
        return {
            sendPosition: sendPosition
        }
    }
    return lps;
})(window);