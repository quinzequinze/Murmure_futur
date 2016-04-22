function radians(degrees) {
    return degrees * Math.PI / 180
}

function degrees(radians) {
    return radians * 180 / Math.PI
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        return 'iOS'
    } else if (userAgent.match(/Android/i)) {
        return 'Android'
    } else {
        return 'unknown'
    }
}
Function.prototype.extend = function(_extention) {
    var extended = (function(_original) {
        return function() {
            _original.apply(_original, arguments)
            _extention.apply(_extention, arguments)
        };
    })(this)
    return extended
}

function dist(x1, y1, x2, y2) {
    if (!x2) {
        x2 = 0
    }
    if (!y2) {
        y2 = 0
    }
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

