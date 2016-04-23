//VJM:
var instal = instal || {}
instal.exploration = (function(window, undefined) {
    function exploration() {
        var collected = new Set()
        var minDist = 1.5
        var canRecord = false

function init(){
    collected = new Set()
}

        function collect() {
            var c = closestSound()
            if (c.dist < minDist && !collected.has(c.id)) {
                collected.add(c.id)
                var collection = document.getElementById('collection')
                collection.textContent = "collection: " + collected.size
            }
            if (collected.size >= config.MAX_COLLECTION && canRecord == false) {
                console.log(config.MAX_COLLECTION)
                console.log(collected.size)
                audio.fadeOut(2,audio.sample)
                canRecord = true
                audio.sfx.instruction = audio.loadSound('record.m4a', function() {
                    allowRecording()
                })
            }
        }

        function allowRecording() {
            document.body.addEventListener("mousedown", beginRecord, false)
            document.body.addEventListener("touchstart", beginRecord, false)
            document.body.addEventListener("mouseup", endRecord, false)
            document.body.addEventListener("touchend", endRecord, false)
            audio.fadeIn(2, audio.sample)
        }

        function disallowRecording() {
            document.body.removeEventListener("mousedown", beginRecord, false)
            document.body.removeEventListener("touchstart", beginRecord, false)
            document.body.removeEventListener("mouseup", endRecord, false)
            document.body.removeEventListener("touchend", endRecord, false)
            canRecord = false
        }

        function beginRecord() {
            audio.fadeOut(0.4, audio.sample)
            document.body.style.background = 'white'
            window.webkit.messageHandlers.scriptMessageHandler.postMessage('beginRecord')
            event.preventDefault()
        }

        function endRecord() {
            audio.fadeIn(2,audio.sample)
            document.body.style.background = '#F3EFE0'
            window.webkit.messageHandlers.scriptMessageHandler.postMessage('endRecord')
            event.preventDefault()
        }
        return {
            collect: collect,
            init: init,
            disallowRecording:disallowRecording
        }
    }
    return exploration
})(window)