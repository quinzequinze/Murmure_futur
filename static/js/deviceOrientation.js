var instal = instal || {};
instal.deviceOrientation = (function(window, undefined) {
    function deviceOrientation() {
        var angles = {
            alpha: 0,
            beta: 0,
            gamma: 0
        }
        var offset = 0;
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function(e) {
                angles.alpha = (e.webkitCompassHeading + getOffset() + 90) % 360
                angles.beta = e.beta
                angles.gamma = e.gamma
            }, false);
        } else {
            console.log('DeviceOrientation error')
        }

        function getOffset() {
            return offset
        }

        function setOffset(_offset) {
            offset = _offset
        }
        return {
            angles: angles,
            setOffset: setOffset
        }
    }
    return deviceOrientation
})(window);
