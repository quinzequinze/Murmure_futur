var instal = instal || {};
instal.debug = {
    self: "",
    up: false,
    down: false,
    left: false,
    right: false,
    mx: 0,
    my: 0,
    xangle: 0,
    yangle: 0,
    zangle: 0,
    keyForward: false,
    keyBackward: false,
    keyLeft: false,
    keyRight: false,
    clock: null,
    setup: function() {
        var self = this;
        window.addEventListener('mousedown', function(ev) {
            self.mx = ev.clientX;
            self.my = ev.clientY;
            self.down = true;
        }, false);
        window.addEventListener('mouseup', function() {
            self.down = false;
        }, false);
        self.xangle = Math.PI;
        self.yangle = 0;
        window.addEventListener('mousemove', function(ev) {
            if (self.down) {
                var dx = ev.clientX - self.mx;
                var dy = ev.clientY - self.my;
                self.mx = ev.clientX;
                self.my = ev.clientY;
                self.xangle -= dx / 100;
                self.yangle = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, self.yangle - dy / 100));
            }
        }, false);
        window.addEventListener('keydown', function(ev) {
            switch (ev.keyCode) {
                case 38:
                    self.keyForward = true;
                    break;
                case 40:
                    self.keyBackward = true;
                    break;
                case 37:
                    self.keyLeft = true;
                    break;
                case 39:
                    self.keyRight = true;
                    break;
            }
        }, false);
        window.addEventListener('keyup', function(ev) {
            switch (ev.keyCode) {
                case 38:
                    self.keyForward = false;
                    break;
                case 40:
                    self.keyBackward = false;
                    break;
                case 37:
                    self.keyLeft = false;
                    break;
                case 39:
                    self.keyRight = false;
                    break;
            }
        }, false);
    },
    moveCamera: function(_camera) {
        var lx = Math.sin(this.xangle);
        var ly = Math.sin(this.yangle);
        var lz = Math.cos(this.xangle);
        /////////
        var cp = _camera.position;
        var camZ = cp.z,
            camX = cp.x,
            camY = cp.y;
        var vz = Math.cos(this.xangle);
        var vx = Math.sin(this.xangle);
        var speed = 10;
        var dt = this.clock.getDelta()
        if (this.keyForward) {
            camX += vx * dt * speed;
            camZ += vz * dt * speed;
        }
        if (this.keyBackward) {
            camX -= vx * dt * speed;
            camZ -= vz * dt * speed;
        }
        if (this.keyLeft) {
            camZ -= vx * dt * speed;
            camX -= -vz * dt * speed;
        }
        if (this.keyRight) {
            camZ += vx * dt * speed;
            camX += -vz * dt * speed;
        }
        _camera.target.position.set(_camera.position.x + lx, _camera.position.y + ly, _camera.position.z + lz);
        _camera.lookAt(_camera.target.position);
        _camera.position.set(camX, camY, camZ);
    },

};