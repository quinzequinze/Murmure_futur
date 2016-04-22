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
            logicItems.collect = exploration.collect
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


    }
})

function getTheme() {
    document.body.removeEventListener("mousedown", getTheme, false)
    document.body.removeEventListener("touchstart", getTheme, false)

    prompt("theme", theme.closest(), "ThemeYep.m4a", "ThemeBof.m4a")
}

function getYear() {
    document.body.removeEventListener("mousedown", getYear, false)
    document.body.removeEventListener("touchstart", getYear, false)

    prompt("year", year.active().name, "Exploration.m4a", "EpoqueBof.m4a")
}