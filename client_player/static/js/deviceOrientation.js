var instal = instal || {};
instal.mobilDebug = {
    self: "",
    tiltForward: false,
    tiltBackward: false,
    tiltLeft: false,
    tiltRight: false,
    clock: null,
    alpha: 0,
    beta: 0,
    gamma: 0,
    xangle: 0,
    yangle: 0,
    zangle: 0,
    setup: function() {
        var self = this;
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function(e) {
                self.alpha = e.alpha;
                self.beta = e.beta;
                self.gamma = e.gamma;
                if (e.beta > 20) {
                    self.tiltBackward = true;
                } else {
                    self.tiltBackward = false;
                }
                if (e.beta < -20) {
                    self.tiltForward = true;
                } else {
                    self.tiltForward = false;
                }
                if (e.gamma > 20) {
                    self.tiltRight = true;
                } else {
                    self.tiltRight = false;
                }
                if (e.gamma < -20) {
                    self.tiltLeft = true;
                } else {
                    self.tiltLeft = false;
                }
            }, false);
        } else {
            console.log("oups pas de device_orientation pour toi gros ringard : www.apple.com / wwww.samsung.com")
        }
    },
    moveCamera: function(_camera) {
        //var dx = 1;
        var dx = Math.PI / 100;
        var dy = Math.PI;
        //this.xangle -= dx/100;
        //this.yangle = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, this.yangle - dy / 100));
        if (this.alpha) {
            this.xangle = radians(this.alpha);
        } else {
            this.xangle = radians(180);
        }
        this.yangle = 0;
        var lx = Math.sin(this.xangle);
        var ly = Math.sin(this.yangle);
        var lz = Math.cos(this.xangle);
        _camera.target.position.set(_camera.position.x + lx, _camera.position.y + ly, _camera.position.z + lz);
        /////////
        var cp = _camera.position;
        var camZ = cp.z,
            camX = cp.x,
            camY = cp.y;
        var vz = Math.cos(this.xangle);
        var vx = Math.sin(this.xangle);
        //var vz = 1;
        //var vx = 1;
        var speed = 10;
        var dt = this.clock.getDelta()
        if (this.tiltForward) {
            camX += vx * dt * speed;
            camZ += vz * dt * speed;
        }
        if (this.tiltBackward) {
            camX -= vx * dt * speed;
            camZ -= vz * dt * speed;
        }
        if (this.tiltLeft) {
            camZ -= vx * dt * speed;
            camX -= -vz * dt * speed;
        }
        if (this.tiltRight) {
            camZ += vx * dt * speed;
            camX += -vz * dt * speed;
        }
        console.log(camX);
        _camera.lookAt(_camera.target.position);
        _camera.position.set(camX, camY, camZ);
    },
};