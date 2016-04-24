//VJM:
var instal = instal || {}
instal.exploration = (function(window, undefined) {
    function exploration() {
        var collected = new Set()
        var minDist = 1
        var maxCollection = 1
        var canRecord
        var instruction
        var proximity = false

        function init() {
            collected = new Set()
            instruction = false
            canRecord = false
        }

        function collect() {
            var c = {}
            for (var key in sound) {
                if (typeof tag[TAG_ID] !== 'undefined') {
                    var distance = dist(tag[TAG_ID].x, tag[TAG_ID].y, sound[key].x * config.ROOM_WIDTH, sound[key].y * config.ROOM_LENGTH)
                    if (distance < c.dist || typeof c.dist == 'undefined') {
                        c.dist = distance
                        c.id = key
                    }
                }
            }
            if (c.dist < minDist) {
                proximity = true
                if (!collected.has(c.id)) {
                    collected.add(c.id)
                    var collection = document.getElementById('collection')
                    collection.textContent = "collection: " + collected.size
                }
            } else {
                proximity = false
            }
            if (collected.size >= maxCollection && !canRecord && !instruction) {
                instruction = true
                audio.fadeOut(1, audio.sample)
               // audio.sfx.instruction = audio.loadSound('record.m4a', false, function() {
                    canRecord = true
                    rec = true
                    audio.fadeIn(3, audio.sample)
              //  })
            }
        }

        function beginRecord() {
            if (canRecord && instruction) {
                audio.fadeOut(0.8, audio.sample)
                window.webkit.messageHandlers.scriptMessageHandler.postMessage('beginRecord')
            }
        }



        function endRecord() {
            if (canRecord && instruction) {
                audio.fadeIn(6, audio.sample)
                window.webkit.messageHandlers.scriptMessageHandler.postMessage('endRecord')
                event.preventDefault()
            }
        }
        function getProximity() {
            return proximity
        }

        return {
            init: init,
            collect: collect,
            beginRecord: beginRecord,
            endRecord: endRecord,
            getProximity: getProximity
        }
    }
    return exploration
})(window)