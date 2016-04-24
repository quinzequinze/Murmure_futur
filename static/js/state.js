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
            audio.fadeOut(0.01, audio.sample)
            ui.wait(true)
            eventUp.wait = starter

        },
        onleavewait: function() {
            ui.wait(false)
            delete eventUp.wait

        },
        onenterintroduction: function() {
            audio.sfx.introduction = audio.loadSound('introduction.m4a', false, function() {
                state.toTheme()
            })
            ui.introduction(true)
        },
        onleaveintroduction: function() {
            if (audio.sfx.introduction) {
                delete audio.sfx.introduction
            }
            ui.introduction(false)
        },
        onentertheme: function() {
            theme.init()
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
        audio.sfx.year = audio.loadSound('year.m4a', false, function() {
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
            ui.year(false)
        },
        onenterexploration: function() {
            audio.fadeIn(3, audio.sample)
            ui.exploration(true)
            exploration.init()
            eventDown.exploration = exploration.beginRecord
            eventUp.exploration = exploration.endRecord
            eventDown.ui = ui.beginRecord
            eventUp.ui = ui.endRecord
            logicItems.exploration = function() {
                exploration.collect()
                if(exploration.canRecord && exploration.instruction){
                                 var s = closestSound().dist
                var t = closestTag().dist
                ui.exploration(true,s,t)   
                }

            }
        },
        onleaveexploration: function() {
            if (logicItems.exploration) {
                delete logicItems.exploration
            }
            audio.fadeOut(3, audio.sample)
            ui.exploration(false)
            delete eventDown.exploration
            delete eventUp.exploration
            delete eventDown.ui
            delete eventUp.ui
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
