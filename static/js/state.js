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
    },{
            name: 'toPrompt',
        from: '*',
        to: 'prompt'
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
            map.drawTheme()
            logicItems.themeCheck = theme.closest
            document.body.addEventListener("mousedown", chooseTheme, false)
            document.body.addEventListener("touchstart", chooseTheme, false)
        },
        onleavetheme: function() {
            if (theme) {
                delete theme
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
        }
    }
})

function tutorielCheck() {
    if (!hasTuto && tutoCounter < maxTuto) {
        addTuto(tutoCounter)
    }
    if (typeof tag[TAG_ID] !== 'undefined' && audio.tutoriel.position) {
        if (dist(tag[TAG_ID].x, tag[TAG_ID].y, audio.tutoriel.position.x, audio.tutoriel.position.y) < minDist) {
            clearTimeout(audio.tutoriel.timeOut)
            if (typeof audio.tutoriel.source !== 'undefined') {
                audio.tutoriel.source.disconnect()
                audio.tutoriel = {}
                audio.loadSound('found.m4a', function() {
                    hasTuto = false
                    tutoCounter += 1
                    if (tutoCounter == maxTuto) {
                        //state.explore()
                    }
                })
            }
        }
    }
}
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

function chooseTheme(){
    console.log(theme.closest())
    toPrompt()
}
/*
        onentertuto: function() {
            logicItems.tutorielCheck = tutorielCheck
        },
        onleavetuto: function() {
            delete logicItems.tutorielCheck
        },*/