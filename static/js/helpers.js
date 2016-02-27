function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
};

function nf(n, width, fillChar) {
    fillChar = fillChar || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(fillChar) + n;
};

function getAngleTo(object, target) {
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyQuaternion(object.quaternion);
    var obj = new THREE.Vector3(object.position.x, 0, object.position.z);
    var tar = new THREE.Vector3(target.position.x, 0, target.position.z);
    angle = vector.angleTo(tar.sub(obj));
    return degrees(angle);
};

function radians(degrees) {
    return degrees * Math.PI / 180;
};

function degrees(radians) {
    return radians * 180 / Math.PI;
};

function mapVar(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        return 'iOS';
    } else if (userAgent.match(/Android/i)) {
        return 'Android';
    } else {
        return 'unknown';
    }
};


Function.prototype.extend = function(_extention) {
    var extended = (function(_original) {
        return function() {
            _original.apply(_original, arguments);
            _extention.apply(_extention, arguments);
        };
    })(this);
    return extended;
};
