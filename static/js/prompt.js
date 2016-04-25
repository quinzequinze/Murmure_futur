//Prompt module [CYM]
/*
function prompt(_type, _choice, _ackSound, _cancelSound) {
    var validator = document.getElementById("validator")
    var yes = document.getElementById("yes")
    var no = document.getElementById("no")
    init();

    function init() {
        if (_type == "year") {
            for (var key in year.sample) {
                delete logicItems.setGain
                year.sample[key].volume.gain.value = 0
            }
        } else if (_type == "theme") {
            audio.fadeOut(1, theme.sample)
        }
        audio.sfx.prompt = audio.loadSound('Choix.m4a',false, function() {
            validator.classList.remove('hidden')
            yes.addEventListener("mousedown", validate, false)
            yes.addEventListener("touchstart", validate, false)
            no.addEventListener("mousedown", cancel, false)
            no.addEventListener("touchstart", cancel, false)
        })
    }

    function exit() {
        validator.classList.add('hidden')
        yes.removeEventListener("mousedown", validate, false)
        yes.removeEventListener("touchstart", validate, false)
        no.removeEventListener("mousedown", cancel, false)
        no.removeEventListener("touchstart", cancel, false)
    }

    function validate() {
        exit()
            //Emit the validated choice to the server to be written in BD
        audio.sfx.prompt = audio.loadSound('Validate.m4a',false, function() {
            audio.sfx.prompt = audio.loadSound(_ackSound,false, function() {
                if (_type == "theme") {
                    choice.theme = _choice
                    state.toYear()
                } else if (_type == "year") {

                }
            })
        })
    }

    function cancel() {
        exit()
        audio.sfx.prompt = audio.loadSound('Cancel.m4a',false, function() {
            audio.sfx.prompt = audio.loadSound(_cancelSound, false, function() {
                if (_type == "theme") {
                    audio.fadeIn(1, theme.sample)
                    document.body.addEventListener("mousedown", getTheme, false)
                    document.body.addEventListener("touchstart", getTheme, false)
                } else if (_type == "year") {
                    logicItems.setGain = year.setGain
                    document.body.addEventListener("mousedown", getYear, false)
                    document.body.addEventListener("touchstart", getYear, false)
                }
            })
        })
    console.log(_choice)
    }
}
*/