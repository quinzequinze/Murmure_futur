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
        onleavewait: function() {
            document.body.removeEventListener("mousedown", starter, false)
            document.body.removeEventListener("touchstart", starter, false)
        },
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
            document.body.removeEventListener("mousedown", getTheme, false)
            document.body.removeEventListener("touchstart", getTheme, false)
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
                year.clear()
                delete logicItems.year
                delete logicItems.setGain
            }
            document.body.removeEventListener("mousedown", getYear, false)
            document.body.removeEventListener("touchstart", getYear, false)
        },
        onenterexploration: function() {
            audio.fadeIn(3)
            exploration.init()
            logicItems.collect = exploration.collect
        },
        onleaveexploration: function() {
            if (logicItems.collect) {
                delete logicItems.collect
            }
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

function getTheme() {
    //put in theme module
    // console.log(theme.closest())
    // document.body.removeEventListener("mousedown", getTheme, false)
    // document.body.removeEventListener("touchstart", getTheme, false)
    
    prompt("theme",theme.closest(),"ThemeYep.m4a","ThemeBof.m4a")
}

function getYear() {
    console.log(year.active())
    state.toPrompt()
}