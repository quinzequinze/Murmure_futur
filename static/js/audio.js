var instal = instal || {}
instal.audio = (function(window, undefined) {
    function audio() {
        var sample = []
        var a = {}
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        a.context = new AudioContext()
        a.convolver = a.context.createConvolver()
        a.volume = a.context.createGain()
        a.mixer = a.context.createGain()
        a.flatGain = a.context.createGain()
        a.convolverGain = a.context.createGain()
        a.destination = a.mixer
        a.mixer.connect(a.flatGain)
        a.mixer.connect(a.convolver)
        a.convolver.connect(a.convolverGain)
        a.flatGain.connect(a.volume)
        a.convolverGain.connect(a.volume)
        a.volume.connect(a.context.destination)
        window.addEventListener('blur', function(event) {
            stop()
        }, false)
        window.addEventListener('focus', function(event) {
            play()
        }, false)
        if (getMobileOperatingSystem() == 'iOS') {
            console.log('[AudioContext] waiting for user event to unlock (iOS)')
                //  window.addEventListener('touchend', iosUnlockSound, false)
        }

        function iosUnlockSound(event) {
            var buffer = a.context.createBuffer(1, 1, 22050)
            var source = a.context.createBufferSource()
            source.buffer = buffer
            source.connect(a.context.destination)
            if (source.play) {
                source.play(0)
                source.disconnect()
            } else if (source.noteOn) {
                source.noteOn(0)
                source.disconnect()
            }
            window.removeEventListener("touchend", iosUnlockSound, false)
            console.log("[AudioContext] unlocked")
        }

        function play() {
            a.volume.connect(a.context.destination)
        }

        function stop() {
            a.volume.disconnect()
        }
        /*
        function setListener(object) {
        object.updateMatrixWorld()
        var q = new THREE.Vector3()
        q.setFromMatrixPosition(object.matrixWorld)
        this.audio.context.listener.setPosition(q.x, q.y, q.z)
        }
        */
        function loadBuffer(soundFileName, callback) {
            var request = new XMLHttpRequest()
            request.open("GET", soundFileName, true)
            request.responseType = "arraybuffer"
            request.onload = function() {
                a.context.decodeAudioData(request.response, callback, function() {
                    console.error("Decoding the audio buffer failed")
                })
            }
            request.send()
            return request
        }

        function loadSound(soundFileName) {
            var s = {}
            s.source = a.context.createBufferSource()
            s.source.loop = true
            s.panner = a.context.createPanner()
            s.volume = a.context.createGain()
            s.biquadFilter = a.context.createBiquadFilter()
            s.biquadFilter.type = "lowpass"
            s.biquadFilter.frequency.value = 10000 //filtre orientation
            s.source.connect(s.volume)
            s.volume.connect(s.biquadFilter)
            s.biquadFilter.connect(s.panner)
            s.panner.connect(a.destination)
            loadBuffer(soundFileName, function(buffer) {
                s.buffer = buffer
                s.source.buffer = s.buffer
                s.source.start(0)
            })
            return s
        }

        function initSounds(data) {
            for (var i in data) {
                sample[i] = loadSound(data[i].path)
                sample[i].panner.setPosition(data[i].x, data[i].y, data[i].z)
            }
            console.log('initSounds | audio')
        }

        function initUsers(data) {
            console.log(data)
            if (data[TAG_ID]) {
                a.context.listener.setPosition(data[TAG_ID].x, data[TAG_ID].y, data[TAG_ID].z)
            }
        }

        function newSound(data) {
            console.log("audio | new sound")
        }
        function updateUsers(data) {
            a.context.listener.setPosition(data[TAG_ID].x, data[TAG_ID].y, data[TAG_ID].z)
console.log("listener x:"+data[TAG_ID].x+" y:"+data[TAG_ID].y+" z:"+data[TAG_ID].z)
           // console.log(data)
        }

        return {
            loadSound: loadSound,
            initSounds: initSounds,
            initUsers: initUsers,
            newSound:newSound,
            updateUsers:updateUsers
        }
    }
    return audio
})(window)