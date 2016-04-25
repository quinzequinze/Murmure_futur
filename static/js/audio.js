var instal = instal || {}
instal.audio = (function(window, undefined) {
    function audio() {
        'use strict';
        var sample = {}
        var sfx = {}
        var defaultGain = 0
        var a = {}
        var fading = false
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        a.context = new window.AudioContext()
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
        window.addEventListener('blur', function() {
            a.volume.disconnect()
        }, false)
        window.addEventListener('focus', function() {
            a.volume.connect(a.context.destination)
        }, false)

        function loadBuffer(soundFileName, callback) {
            var request = new XMLHttpRequest()
            request.open('GET', soundFileName, true)
            request.responseType = 'arraybuffer'
            request.onload = function() {
                a.context.decodeAudioData(request.response, callback, function() {
                    console.error('Decoding the audio buffer failed')
                })
            }
            request.send()
            return request
        }

        function loadSound3D(soundFileName, loop, callback) {
            var s = {}
            s.maxDelay = 1000
            s.randomLooping = loop
            s.panner = a.context.createPanner()
            s.panner.refDistance = 1
            s.panner.distanceModel = 'exponential';
            s.panner.rolloffFactor = 3
            s.volume = a.context.createGain()
            s.volume.gain.value = defaultGain
            s.biquadFilter = a.context.createBiquadFilter()
            s.biquadFilter.type = 'lowpass'
            s.biquadFilter.frequency.value = 10000 //filtre orientation
            s.volume.connect(s.biquadFilter)
            s.biquadFilter.connect(s.panner)
            s.panner.connect(a.destination)
            loadBuffer(soundFileName, function(buffer) {
                s.buffer = buffer
                if (s.randomLooping) {
                    randomLoop(s)
                }
                if (callback) {
                    var delay = s.buffer.duration ? Math.ceil(s.buffer.duration * 1000) + 1000 : 1000
                    setTimeout(callback, delay)
                }
            })
            return s
        }

        function randomLoop(audioNode) {
            var delay = randomInt(1000, audioNode.maxDelay)
            audioNode.source = a.context.createBufferSource()
            audioNode.source.buffer = audioNode.buffer
            audioNode.source.connect(audioNode.volume)
            audioNode.source.start(a.context.currentTime + delay / 1000)
            audioNode.timeOut = setTimeout(function() {
                randomLoop(audioNode)
            }, (audioNode.source.buffer.duration * 1000) + delay)
        }

        function fadeOut(duration, _sample) {
            defaultGain = 0
            for (var key in _sample) {
                var currentTime = a.context.currentTime
                var fadeTime = currentTime + duration
                _sample[key].volume.gain.cancelScheduledValues(currentTime)
                _sample[key].volume.gain.setValueAtTime(_sample[key].volume.gain.value, currentTime)
                _sample[key].volume.gain.linearRampToValueAtTime(0, fadeTime)
            }
        }

        function fadeIn(duration, _sample) {
            defaultGain = 1
            for (var key in _sample) {
                var currentTime = a.context.currentTime
                var fadeTime = currentTime + duration
                _sample[key].volume.gain.cancelScheduledValues(currentTime)
                _sample[key].volume.gain.setValueAtTime(_sample[key].volume.gain.value, currentTime)
                _sample[key].volume.gain.linearRampToValueAtTime(1, fadeTime)
            }
        }

        function loadSound(soundFileName, loop, callback) {
            var s = {}
            s.maxDelay = 1000
            if (!loop) {
                s.randomLooping = false
            } else {
                s.randomLooping = loop
            }
            s.source = a.context.createBufferSource()
            s.source.loop = false
            s.source.onended = function() {}
            s.volume = a.context.createGain()
            s.source.connect(s.volume)
            s.volume.connect(a.destination)
            loadBuffer(soundFileName, function(buffer) {
                s.buffer = buffer
                s.source.buffer = s.buffer
                s.source.start(a.context.currentTime + 1)
                var delay = s.buffer.duration ? Math.ceil(s.buffer.duration * 1000) + 1000 : 1000
                if (callback) {
                    s.timeOut = setTimeout(callback, delay)
                }
                if (s.randomLooping) {
                    randomLoop(s)
                }
            })
            return s
        }
        return {
            sample: sample,
            listener: a.context.listener,
            fadeIn: fadeIn,
            fadeOut: fadeOut,
            loadSound: loadSound,
            loadSound3D: loadSound3D,
            randomLoop: randomLoop,
            sfx: sfx,
        }
    }
    return audio
})(window)