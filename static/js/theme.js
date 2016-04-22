var instal = instal || {}
instal.theme = (function(window, undefined) {
    function theme() {
        var sample = {}
        var list = {
            /*
            Argent: {
                x: 0.1,
                y: 1
            },
            Guerre: {
<<<<<<< HEAD
                x: 0.2,
                y: 0.9
=======
                x: 1,
                y: 0
>>>>>>> years
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
<<<<<<< HEAD
                x: 1,
                y: 0.1
            },
=======
                x: 0.5,
                y: 0.4
            },

            Mort: {
                x: 0,
                y: 0
            }
            
>>>>>>> years
        }

        function init() {
            for (var key in list) {
                list[key].x = list[key].x * config.ROOM_WIDTH
                list[key].y = list[key].y * config.ROOM_LENGTH
            }
        }

        function loadSound() {
            for (var key in list) {
                sample[key] = audio.loadSound3D(key + '.m4a', true)
                sample[key].panner.setPosition(list[key].x, list[key].y, 0)
                sample[key].volume.gain.value = 1
            }
        }

        function closest() {
            var t = {}
            for (var key in list) {
                if (typeof tag[TAG_ID] !== 'undefined') {
                    var distance = dist(tag[TAG_ID].x, tag[TAG_ID].y, list[key].x, list[key].y)
                    if (distance < t.dist || typeof t.dist == 'undefined') {
                        t.dist = distance
                        t.name = key
                    }
                }
            }
            var thematique = document.getElementById('thematique')
            thematique.textContent = t.name
            return t
        }
        return {
            loadSound: loadSound,
            list: list,
            closest: closest,
            init: init
        }
    }
    return theme
})(window)