var state = StateMachine.create({
    events: [{
        name: 'toIntroduction',
        from: '*',
        to: 'introduction'
    }, {
        name: 'toExploration',
        from: '*',
        to: 'exploration'
    }, {
        name: 'toWait',
        from: '*',
        to: 'wait'
    }, {
        name: 'toTheme',
        from: '*',
        to: 'theme'
    }, {
        name: 'toPrompt',
        from: '*',
        to: 'prompt'
    }, {
        name: 'toYear',
        from: '*',
        to: 'year'
    }],
    callbacks: {
        onenterwait: function() {
            audio.fadeOut(0.5)
            document.body.addEventListener("mousedown", starter, false)
            document.body.addEventListener("touchstart", starter, false)
        },
        onleavewait: function() {},
        onenterintroduction: function() {
            audio.sfx.introduction = audio.loadSound('introduction.m4a', function() {
                state.toTheme()
            })
        },
        onleaveintroduction: function() {
            if (audio.sfx.introduction) {
                delete audio.sfx.introduction
            }
        },
        onentertheme: function() {
            theme.init()
            theme.loadSound()

            if (map) {
                map.drawTheme()
            }
            logicItems.theme = theme.closest
            document.body.addEventListener("mousedown", getTheme, false)
            document.body.addEventListener("touchstart", getTheme, false)

        },
        onleavetheme: function() {
            if (theme) {
                delete theme
                delete logicItems.theme
            }
            if (map) {
                map.removeTheme()
            }
        },
        onenteryear: function() {
            console.log("onenteryear")
            year.init()
            year.loadSound()
            if (map) {
                //map.drawYear()
            }
            logicItems.active = year.active
            logicItems.setGain = year.setGain
            document.body.addEventListener("mousedown", getYear, false)
            document.body.addEventListener("touchstart", getYear, false)
        },
        onleaveyear: function() {
            if (year) {
                delete year
                delete logicItems.year
                delete logicItems.setGain
            }
        },
        onenterexploration: function() {
            audio.fadeIn(3)
            logicItems.collectionCheck = collectionCheck
        },
        onleaveexploration: function() {
            if (logicItems.collectionCheck) {
                delete logicItems.collectionCheck
            }
        },
        onenterstate: function() {
            if (state) {
                var status = document.getElementById('status')
                status.textContent = state.current
                var status = {}
                status.id = TAG_ID
                status.state = state.current
                socket.emit('stateChange', status)
            }
        },
        onenterprompt: function() {
            var validator = document.getElementById("validator")
            validator.classList.remove('hidden')
            var yes = document.getElementById("yes")
            var no = document.getElementById("no")
            console.log(validator)
            yes.onclick = function() {
                console.log("yes")
                console.log(theme.closest())
                state.toYear()
                // socket.emit('validate', player.dataset.sound)
                // var valid = document.getElementById(player.dataset.sound)
                // validator.classList.add('hidden')
            }
            no.onclick = function() {
                console.log("no")
                console.log(theme.closest())
                state.toTheme()
                // socket.emit('invalidate', player.dataset.sound)
                // validator.classList.add('hidden')
            }
        },
        onleaveprompt: function() {
            var validator = document.getElementById("validator")
            validator.classList.add('hidden')
        }
        
    }
})
var soundCollection = new Set()
var minDist = 1.5
var maxTuto = 10
var tutoCounter = 0
var hasTuto = false

function addTuto(_soundName) {
    audio.tutoriel = audio.loadSound3D(_soundName + '.m4a', true)
    audio.tutoriel.volume.gain.value = 1
    audio.tutoriel.position = {
        x: randomInt(0, config.ROOM_WIDTH),
        y: randomInt(0, config.ROOM_LENGTH),
        z: 0
    }
    audio.tutoriel.panner.setPosition(audio.tutoriel.position.x, audio.tutoriel.position.y, 0)
    hasTuto = true
}

function collectionCheck() {
    var c = closestSound()
    if (c.dist < minDist && !soundCollection.has(c.id)) {
        soundCollection.add(c.id)
        var collection = document.getElementById('collection')
        collection.textContent = soundCollection.size
    }
    if (soundCollection.size >= config.MAX_COLLECTION && canRecord == false) {
        //state.recordTuto()
    }
}

function allowRecording() {
    canRecord = true
    document.body.addEventListener("mousedown", beginRecord, false)
    document.body.addEventListener("touchstart", beginRecord, false)
    document.body.addEventListener("touchstart", beginRecord, false);
    document.body.addEventListener("touchend", endRecord, false);
}

function disallowRecording() {
    canRecord = false
    document.body.removeEventListener("mousedown", beginRecord, false)
    document.body.removeEventListener("touchstart", beginRecord, false)
    document.body.removeEventListener("touchstart", beginRecord, false);
    document.body.removeEventListener("touchend", endRecord, false);
}

function beginRecord() {
    audio.fadeOut(0.4)
    document.body.style.background = '#FFBB00'
    window.webkit.messageHandlers.scriptMessageHandler.postMessage('beginRecord')
    event.preventDefault();
}

function endRecord() {
    audio.fadeIn(0.4)
    document.body.style.background = '#F3EFE0'
    window.webkit.messageHandlers.scriptMessageHandler.postMessage('endRecord')
    event.preventDefault();
}

function getTheme() {
    console.log(theme.closest())
    document.body.removeEventListener("mousedown", getTheme, false)
    document.body.removeEventListener("touchstart", getTheme, false)
    state.toPrompt()
}

function getYear() {
    console.log(year.active())
    state.toPrompt()
}