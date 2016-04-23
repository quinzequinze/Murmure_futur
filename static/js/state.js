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
            document.body.addEventListener("mousedown", starter, false)
            document.body.addEventListener("touchstart", starter, false)
        },
        onleavewait: function() {
            ui.wait(false)
            document.body.removeEventListener("mousedown", starter, false)
            document.body.removeEventListener("touchstart", starter, false)
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
            if (typeof map !== 'undefined') {
                map.drawTheme()
            }
            logicItems.theme = function() {
                if (theme.closest() == false) {
                    ui.theme(false)
                } else {
                    ui.theme(true)
                }
            }
            document.body.addEventListener("mousedown", getTheme, false)
            document.body.addEventListener("touchstart", getTheme, false)
        },
        onleavetheme: function() {
            if (theme) {
                theme.kill()
                delete theme
                delete logicItems.theme
            }
            if (typeof map !== 'undefined') {
                map.removeTheme()
            }
            document.body.removeEventListener("mousedown", getTheme, false)
            document.body.removeEventListener("touchstart", getTheme, false)
            ui.theme(false)
        },
        onenteryear: function() {
            //audio.sfx.introduction = audio.loadSound('year.m4a', false, function() {
            year.init()
            if (typeof map !== 'undefined') {
                //map.drawYear()
            }
            logicItems.active = function (){
                var a = year.active()
                ui.year(a)
            }
            logicItems.setGain = year.setGain
            document.body.addEventListener("mousedown", getYear, false)
            document.body.addEventListener("touchstart", getYear, false)
            
                // })
        },
        onleaveyear: function() {
            if (year) {
                year.kill()
                delete logicItems.year
                delete logicItems.setGain
            }
            document.body.removeEventListener("mousedown", getYear, false)
            document.body.removeEventListener("touchstart", getYear, false)
        },
        onenterexploration: function() {
            audio.fadeIn(3, audio.sample)
            exploration.init()
            logicItems.collect = exploration.collect
            ui.exploration(true)
        },
        onleaveexploration: function() {
            if (logicItems.collect) {
                delete logicItems.collect
            }
            audio.fadeOut(3, audio.sample)
            exploration.disallowRecording()
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
    }
})

function getTheme() {
    if (theme.closest()) {
        prompt("theme", theme.closest().name, "ThemeYep.m4a", "ThemeBof.m4a")
        document.body.removeEventListener("mousedown", getTheme, false)
        document.body.removeEventListener("touchstart", getTheme, false)
    }
}

function getYear() {
    document.body.removeEventListener("mousedown", getYear, false)
    document.body.removeEventListener("touchstart", getYear, false)
    prompt("year", year.active().name, "Exploration.m4a", "EpoqueBof.m4a")
}