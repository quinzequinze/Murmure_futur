//VJM:
var instal = instal || {}
instal.exploration = (function(window, undefined) {
    function exploration() {
        var collected = new Set()
        var minDist = 1.5

        function collect() {
            var c = closestSound()
            if (c.dist < minDist && !collected.has(c.id)) {
                collected.add(c.id)
                var collection = document.getElementById('collection')
                collection.textContent = collected.size
            }
            if (collected.size >= config.MAX_COLLECTION && canRecord == false) {
                allowRecording()
            }
        }

        function allowRecording() {
            document.body.addEventListener("mousedown", beginRecord, false)
            document.body.addEventListener("touchstart", beginRecord, false)
            document.body.addEventListener("touchstart", beginRecord, false);
            document.body.addEventListener("touchend", endRecord, false);
        }

        function disallowRecording() {
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
        return {}
    }
    return exploration
})(window)