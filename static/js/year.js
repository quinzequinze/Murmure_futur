//VJM:
var instal = instal || {}
instal.year = (function(window, undefined) {
    function year() {
        var sample = {}
        var length
        var list = ['2017', '2027', '2100', '3000']

        function init() {
            audio.sfx.introduction = audio.loadSound('year.m4a', function() {
                length = config.ROOM_WIDTH < config.ROOM_LENGTH ? config.ROOM_LENGTH : config.ROOM_WIDTH
                console.log(length)
            })

        }

        function loadSound() {
            for (var i = 0; i < list.length; i++) {
                sample[i] = audio.loadSound(list[i] + '.m4a')
                sample[i].source.loop = true
                sample[i].volume.gain.value = 0
            }
        }

        function setGain() {
            var s = active().step
            for (var i = 0; i < list.length; i++) {
                if (i == active().step - 1) {
                    sample[i].volume.gain.value = active().value
                } else {
                    sample[i].volume.gain.value = 0
                }
            }
        }

        function active() {
            var y = {}
            if (typeof tag[TAG_ID] != 'undefined') {
                y.step = Math.floor(list.length * (tag[TAG_ID].x / length) + 1)
                y.value = (list.length * (tag[TAG_ID].x / length) + 1) - y.step
                y.name = list[y.step]
                if (y.step < 1) {
                    y.step = 1
                    y.value = 0
                }
                if (y.step > list.length) {
                    y.step = list.length
                    y.value = 1
                }
                var annee = document.getElementById('annee')
                annee.textContent = y.step
            }
            return y
        }

        function clear() {
            for (var key in sample) {
                if (sample[key].source) {
                    sample[key].source.disconnect()
                }
                clearTimeout(sample[key].timeOut)
            }
        }
        return {
            loadSound: loadSound,
            setGain: setGain,
            list: list,
            active: active,
            init: init
        }
    }
    return year
})(window)