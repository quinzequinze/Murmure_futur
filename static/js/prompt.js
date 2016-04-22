//Prompt module [CYM]
function prompt(_type,_choice,_ackSound,_cancelSound) {
    var validator = document.getElementById("validator")
    var yes = document.getElementById("yes")
    var no = document.getElementById("no")
    console.log("prompt")
    console.log(_type)
    init();

    function init() {
        audio.sfx.prompt = audio.loadSound('Choix.m4a', function() {
            validator.classList.remove('hidden')
            yes.addEventListener("mousedown", validate, false)
            // yes.addEventListener("touchstart", validate, false)

            no.addEventListener("mousedown", cancel, false)
            // no.addEventListener("touchstart", cancel, false)
        })

        
    }

    function exit() {
        validator.classList.add('hidden')
        yes.removeEventListener("mousedown", validate, false)
        // yes.removeEventListener("touchstart", validate, false)

        no.removeEventListener("mousedown", cancel, false)
        // no.removeEventListener("touchstart", cancel, false)
    }


    function validate() {
        console.log("yes")
        //Emit the validated choice to the server to be written in BD
        audio.sfx.prompt = audio.loadSound('Validate.m4a', function() {
            audio.sfx.prompt = audio.loadSound(_ackSound, function() {
                exit()
                return true
            })
        })

         
    }

    function cancel() {
        console.log("no")
        audio.sfx.prompt = audio.loadSound('Cancel.m4a', function() {
            audio.sfx.prompt = audio.loadSound(_cancelSound, function() {
                exit()
                return false
            })
        })
    }

}