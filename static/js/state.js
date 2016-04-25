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
        name: 'toYear',
        from: '*',
        to: 'year'
    }, {
        name: 'toBackground',
        from: '*',
        to: 'background'
    }],
    callbacks: {
        onenterbackground: function() {

        },
        onleavebackground: function() {

        },
        onenterwait: function() {
            audio.fadeOut(0.01, audio.sample)
            ui.reset()
            ui.wait(true)
            eventUp.wait = function() {
                state.toIntroduction()
            }
        },
        onleavewait: function() {
            ui.wait(false)
            delete eventUp.wait
        },
        onenterintroduction: function() {
            ui.introduction(true)
            audio.sfx.tuto = audio.loadSound('introduction.m4a', false, function() {
                state.toTheme()
            })
        },
        onleaveintroduction: function() {
            if (audio.sfx.tuto) {
                delete audio.sfx.tuto
            }
            ui.introduction(false)
            console.log("leaveintro")
        },
        onentertheme: function() {
            theme.init()
            ui.reset()
            eventUp.theme = theme.getTheme
            if (typeof map !== 'undefined') {
                map.drawTheme()
            }
            logicItems.theme = function() {
                var c = theme.closest()
                if (c == false) {
                    ui.theme(false)
                } else {
                    ui.theme(true)
                }
            }
        },
        onleavetheme: function() {
            if (theme) {
                theme.kill()
                delete logicItems.theme
                delete eventUp.theme
            }
            if (typeof map !== 'undefined') {
                map.removeTheme()
            }
            ui.theme(false)
        },
        onenteryear: function() {
            audio.sfx.tuto = audio.loadSound('year.m4a', false, function() {
                year.init()
                eventUp.year = year.getYear
                if (typeof map !== 'undefined') {
                    //map.drawYear()
                }
                logicItems.year = function() {
                    var a = year.active()
                    year.setGain()
                    ui.year(a)
                }
            })
        },
        onleaveyear: function() {
            if (year) {
                year.kill()
                delete logicItems.year
            }
            delete eventUp.year
            delete audio.sfx.tuto
            ui.year(false)
        },
        onenterexploration: function() {
            //VJM
            audio.sfx.tuto = audio.loadSound('exploration.m4a', false, function() {
                exploration.init()
                audio.fadeIn(6, audio.sample)
                    //
                eventDown.exploration = exploration.beginRecord
                eventUp.exploration = exploration.endRecord
                eventDown.ui = ui.beginRecord
                eventUp.ui = ui.endRecord
                    //
                logicItems.exploration = function() {
                    exploration.collect()
                    ui.exploration(exploration.getProximity())
                }
            })
        },
        onleaveexploration: function() {
            if (logicItems.exploration) {
                delete logicItems.exploration
            }
            audio.fadeOut(1, audio.sample)
            ui.exploration(false)
            delete eventDown.exploration
            delete eventUp.exploration
            delete eventDown.ui
            delete eventUp.ui
            delete audio.sfx.tuto
        },
        onenterstate: function() {
            if (state) {
                var status = document.getElementById('status')
                status.textContent = state.current
                var status = {}
                status.id = TAG_ID
                status.state = state.current
                socket.emit('stateChange', status)
                console.log('state : ' + state.current)
            }
        },
    }
})