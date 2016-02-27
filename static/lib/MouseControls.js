// @author dmarcos / http://github.com/dmarcos

THREE.MouseControls = function(object) {
    var scope = this;
    var PI_2 = Math.PI / 2;
    var mouseQuat = {
        x: new THREE.Quaternion(),
        y: new THREE.Quaternion()
    };
    var object = object;
    var xVector = new THREE.Vector3(1, 0, 0);
    var yVector = new THREE.Vector3(0, 1, 0); 
    var vz =0;
    var vx =0;
    var mousePressed = false;
    var keyPressed = {
        up: false,
        down: false,
        lest: false,
        right: false
    };
    var onKeyDown = function(event) {
        if (scope.enabled === false) return;
        switch (event.keyIdentifier) {
            case "Down":
                keyPressed.down = true;
                break;
            case "Up":
                keyPressed.up = true;
                break;
            case "Left":
                keyPressed.left = true;
                break;
            case "Right":
                keyPressed.right = true;
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    }
    var onKeyUp = function(event) {
        if (scope.enabled === false) return;
        switch (event.keyIdentifier) {
            case "Down":
                keyPressed.down = false;
                break;
            case "Up":
                keyPressed.up = false;
                break;
            case "Left":
                keyPressed.left = false;
                break;
            case "Right":
                keyPressed.right = false;
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    }
    var onMouseDown = function(event) {
        if (scope.enabled === false) return;
        mousePressed = true;
    };
    var onMouseUp = function(event) {
        if (scope.enabled === false) return;
        mousePressed = false;
    };
    var onMouseMove = function(event) {
        if (scope.enabled === false) return;
        if (!mousePressed) return;
        var orientation = scope.orientation;
        var movementX = event.movementX || event.mozMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || 0;
        orientation.y += movementX * 0.0025;
        orientation.x += movementY * 0.0025;
        orientation.x = Math.max(-PI_2, Math.min(PI_2, orientation.x));
        vz = Math.cos(orientation.y);
        vx = Math.sin(orientation.y);
    };
    this.enabled = true;
    this.orientation = {
        x: 0,
        y: 0,
    };
    this.update = function(delta) {
        if (this.enabled === false) return;
        mouseQuat.x.setFromAxisAngle(xVector, 0);
        mouseQuat.y.setFromAxisAngle(yVector, this.orientation.y);
        object.quaternion.copy(mouseQuat.y).multiply(mouseQuat.x);
        var speed = delta*10;
        if (keyPressed.up === true) {
            object.position.x -= vx * speed;
            object.position.z -= vz * speed;
        }
        if (keyPressed.down === true) {
            object.position.x += vx * speed;
            object.position.z += vz * speed;
        }
        if (keyPressed.left === true) {
            object.position.x += -vz * speed;
            object.position.z += vx * speed;
        }
        if (keyPressed.right === true) {
            object.position.x -= -vz * speed;
            object.position.z -= vx * speed;
        }
        return;
    };
    this.dispose = function() {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mousedown', onMouseDown, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        document.removeEventListener('keydown', onKeyDown, false);
        document.removeEventListener('keyup', onKeyUp, false);
    }
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
};