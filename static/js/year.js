//VJM:
var instal = instal || {}
instal.year = (function(window, undefined) {
    function year() {
        var sample = {}
        var length
        var list = ['2017', '2027', '2100', '3000']

        function init() {
            length = config.ROOM_WIDTH < config.ROOM_LENGTH ? config.ROOM_LENGTH : config.ROOM_WIDTH
            for (var i = 0; i < list.length; i++) {
                sample[i] = audio.loadSound(list[i] + '.m4a',true)
                sample[i].maxDelay = 5000
                //sample[i].source.loop = true
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

        function kill() {
            for (var key in sample) {
                if (sample[key].source) {
                    sample[key].source.disconnect()
                }
                clearTimeout(sample[key].timeOut)
            }
            sample = {}
        }
        return {
            setGain: setGain,
            list: list,
            active: active,
            init: init,
            kill: kill,
            sample: sample
        }
    }
    return year
})(window)