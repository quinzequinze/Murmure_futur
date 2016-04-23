var instal = instal || {}
instal.theme = (function(window, undefined) {
    var minDist = 1

    function theme() {
        var sample = {}
        var list = {
            /*
            Argent: {
                x: 0.1,
                y: 1
            },
            Guerre: {
                x: 1,
                y: 0
            },
            Temps: {
                x: 0.3,
                y: 0.8
            },
            TonFuture: {
                x: 0.4,
                y: 0.7
            },
            Transport: {
                x: 0.5,
                y: 0.6
            },
            Heritage: {
                x: 0.6,
                y: 0.5
            },
            Imortalite: {
                x: 0.7,
                y: 0.4
            },
            Liberte: {
                x: 0.8,
                y: 0.3
            },
            Loisir: {
                x: 0.9,
                y: 0.2
            },
            */
            Mode: {
                x: 0.5,
                y: 0.5
            },
            Mort: {
                x: 0,
                y: 0
            }
        }

        function init() {
            for (var key in list) {
                list[key].x = list[key].x * config.ROOM_WIDTH
                list[key].y = list[key].y * config.ROOM_LENGTH
            }
            for (var key in list) {
                sample[key] = audio.loadSound3D(key + '.m4a', true)
                sample[key].maxDelay = 4000
                sample[key].panner.setPosition(list[key].x, list[key].y, 0)
                sample[key].volume.gain.value = 1
            }
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

        function closest() {
            var t = {}
            var thematique = document.getElementById('thematique')
            for (var key in list) {
                if (typeof tag[TAG_ID] !== 'undefined') {
                    var distance = dist(tag[TAG_ID].x, tag[TAG_ID].y, list[key].x, list[key].y)
                    if (distance < t.dist || typeof t.dist == 'undefined') {
                        t.dist = distance
                        t.name = key
                    }
                }
            }
            if (t.dist > minDist) {
                document.body.classList.remove('light')
                thematique.textContent = 'undefined'
                return false
            } else {
                document.body.classList.add('light')
            }
            thematique.textContent = t.name
            return t
        }
        return {
            list: list,
            closest: closest,
            init: init,
            sample: sample,
            kill: kill
        }
    }
    return theme
})(window)