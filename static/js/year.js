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
            for (var key in list) {
                /*
                sample[key] = audio.loadSound(key + '.m4a')
                //sample[key].panner.setPosition(list[key].x * config.ROOM_WIDTH, list[key].y * config.ROOM_LENGTH, 0)
                sample[key].source.loop = true
                sample[key].volume.gain.value = 1
                */
            }
        }

        function active() {
            var y = {}
            var annee = document.getElementById('annee')
            if(typeof tag[TAG_ID] != 'undefined'){
            annee.textContent = tag[TAG_ID].x%(length/list.length);
            //console.log(length/tag[TAG_ID].y%list.length)
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