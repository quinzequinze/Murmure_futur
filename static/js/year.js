//VJM:
var instal = instal || {}
instal.year = (function(window, undefined) {
    function year() {
        var sample = {}
        var length
        var list = ['2017.m4a', '2027.m4a', '2100.m4a', '3000.m4a']

        function init() {
            length = config.ROOM_WIDTH < config.ROOM_LENGTH ? config.ROOM_LENGTH : config.ROOM_WIDTH
            console.log(length)
        }

        function loadSound() {
            for (var i=0;i<list.length ;i++) {
                /*
                sample[key] = audio.loadSound(list[i] + '.m4a')
                sample[key].source.loop = true
                sample[key].volume.gain.value = 1
                */
            }
        }

        function active() {
            var y = {}
            if (typeof tag[TAG_ID] != 'undefined') {
                var annee = document.getElementById('annee')
                annee.textContent = Math.floor(list.length * (tag[TAG_ID].x/length) + 1)
            }
            return y
        }
        return {
            loadSound: loadSound,
            list: list,
            active: active,
            init: init
        }
    }
    return year
})(window)