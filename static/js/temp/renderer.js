//todoo ? shader foireux ? 
var instal = instal || {}
instal.renderer = (function(window, undefined) {
    function renderer() {
        var scene = new THREE.Scene()
        var camera = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 1000)
        camera.y = 4
        var webgl = new THREE.WebGLRenderer()
        var clock = new THREE.Clock(true)
        var controls = new THREE.MouseControls(camera) //boolean -> controls.enable 
        var looping = true
        var groundMirror
        var verticalMirror
        var mesh = []
        webgl.domElement.style.position = 'absolute'
        webgl.domElement.style.left = webgl.domElement.style.top = '0px';
        window.document.body.appendChild(webgl.domElement)
        window.addEventListener('resize', resizeRender, false)
        resizeRender()
        loop()

        function resizeRender() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix()
            webgl.setSize(window.innerWidth, window.innerHeight);
        }

        function loop() {
            if (looping == true) {
                requestAnimationFrame(loop)
                render()
            }
        }

        function render() {
            controls.update(clock.getDelta());
            if (groundMirror !== undefined && backMirror !== undefined) {
                groundMirror.render()
                backMirror.render()
            }
            webgl.render(scene, camera)
        }

        function newConfig(data) {
            var room = geometry.room(data.ROOM_WIDTH, data.ROOM_LENGTH)
            var light = geometry.light()
            for (var i in room) {
                scene.add(room[i]);
            }
            for (var i in light) {
                 scene.add(light[i]);
            }
        }

        function initSounds(data) {
            for (var i in data) {
                mesh[i] = geometry.sound();
                mesh[i].position.set(data[i].x, data[i].y, data[i].z)
                scene.add(mesh[i]);
            }
        }

        function newSound(data) {
            console.log("renderer | new sound")
        }
        return {
            render: render,
            initSounds: initSounds,
            newConfig: newConfig,
            newSound:newSound,
            camera:camera
        }
    }
    return renderer
})(window)