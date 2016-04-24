//VJM:
var instal = instal || {}
instal.exploration = (function(window, undefined) {
    function exploration() {
        var collected = new Set()
        var minDist = 1.5
        var canRecord = false
        var MaxCollection = 0
        var instruction = false

        function init() {
            collected = new Set()
        }

        function collect() {
            var c = closestSound()
            if (c.dist < minDist && !collected.has(c.id)) {
                collected.add(c.id)
                var collection = document.getElementById('collection')
                collection.textContent = "collection: " + collected.size
            }
            if (collected.size >= MaxCollection && canRecord == false) {
                audio.fadeOut(1, audio.sample)
                canRecord = true
                audio.sfx.instruction = audio.loadSound('record.m4a', false, function() {
                    instruction = true
                })
            }
        }

        function beginRecord() {
            if (canRecord && instruction) {
                audio.fadeOut(0.4, audio.sample)
                window.webkit.messageHandlers.scriptMessageHandler.postMessage('beginRecord')
            }
        }

        function endRecord() {
            if (canRecord && instruction) {
                audio.fadeIn(2, audio.sample)
                window.webkit.messageHandlers.scriptMessageHandler.postMessage('endRecord')
                event.preventDefault()
            }
        }
        return {
            init: init,
            collect: collect,
            beginRecord: beginRecord,
            endRecord: endRecord
        }
    }
    return exploration
})(window)