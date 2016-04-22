var instal = instal || {};
instal.interface = (function(window, undefined) {

        recorder.addEventListener("touchstart", function() {
            window.webkit.messageHandlers.scriptMessageHandler.postMessage('beginRecord')
            recorder.classList.add('recording')
            event.preventDefault();
        }, false);
        recorder.addEventListener("touchend", function() {
            window.webkit.messageHandlers.scriptMessageHandler.postMessage('endRecord')
            recorder.classList.remove('recording')
            event.preventDefault();
        }, false);
        return {

        }
    }
    return interface;
})(window);