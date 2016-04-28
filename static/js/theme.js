var instal = instal || {}
instal.theme = (function(window, undefined) {
    var minDist = 1
    var event

    function theme() {
        var sample = {}
        var self = this
        var list = {

            apprendre: {
                x: 0,
                y: 0
            },
            arts: {
                x: 0.33,
                y: 0
            },
            bouger: {
                x: 0.66,
                y: 0
            },
            comunication: {
                x: 1,
                y: 0
            }

            ,
            ethique: {
                x: 0,
                y: 0.33
            },
            frontieres: {
                x: 0.33,
                y: 0.33
            },
            liberte: {
                x: 0.66,
                y: 0.33
            },
            marche: {
                x: 1,
                y: 0.33
            }

            ,
            medecine: {
                x: 0,
                y: 0.66
            },
            naturel: {
                x: 0.33,
                y: 0.66
            }

            ,
            performance: {
                x: 0.66,
                y: 0.66
            },
            progres: {
                x: 1,
                y: 0.66
            }
/*
            ,
            resources: {
                x: 0,
                y: 1
            },
            style: {
                x: 0.33,
                y: 1
            },
            succes: {
                x: 0.66,
                y: 1
            },
            toi: {
                x: 1,
                y: 1
            }

*/
            ///////////////
            //vie: {
            //    x: 0.1,
            //    y: 1
            //}
        }

        function init() {
            for (var key in list) {
                sample[key] = audio.loadSound3D(key + '.m4a', true)
                sample[key].maxDelay = 4000
                sample[key].panner.setPosition(list[key].x * config.ROOM_WIDTH, list[key].y * config.ROOM_LENGTH, 0)
                sample[key].volume.gain.value = 10
            }
        }

        function kill() {
            console.log(sample)
            for (var key in sample) {
                if (sample[key].source) {
                    sample[key].source.disconnect()
                }
                clearTimeout(sample[key].timeOut)
            }
            sample = {}
        }

        function getTheme() {
            if (closest()) {
                console.log("get theme : " + this)
                audio.sfx.valid = audio.loadSound('validate.m4a')
                choice.theme = closest().name
                state.toYear()
            }
        }

        function closest() {
            var t = {}
            var thematique = document.getElementById('thematique')
            for (var key in list) {
                if (typeof tag[TAG_ID] !== 'undefined') {
                    var distance = dist(tag[TAG_ID].x, tag[TAG_ID].y, list[key].x * config.ROOM_WIDTH, list[key].y * config.ROOM_LENGTH)
                    if (distance < t.dist || typeof t.dist == 'undefined') {
                        t.dist = distance
                        t.name = key
                    }
                }
            }
            if (t.dist > minDist) {
                if (debug) {
                    thematique.textContent = 'undefined'
                }
                return false
            }
            if (debug) {
                thematique.textContent = t.name
            }
            return t
        }
        return {
            init: init,
            closest: closest,
            kill: kill,
            getTheme: getTheme
        }
    }
    return theme
})(window)