var instal = instal || {};
instal.renderer = {
    scene: null,
    webGlRenderer: new THREE.WebGLRenderer(),
    camera: new THREE.PerspectiveCamera(45, this.width / this.height, 0.01, 1000),
    setup: function(_scene) {
        //camera

        this.scene=_scene;
        // console.log(this.scene.position);
        this.camera.position.x = this.scene.position.x;
        this.camera.position.z = this.scene.position.z;
        this.camera.position.y = 0;
        this.camera.target = new THREE.Object3D();
        //webGL Renderer dans la page web
        this.webGlRenderer.domElement.style.position = 'absolute';
        this.webGlRenderer.domElement.style.left = this.webGlRenderer.domElement.style.top = '0px';
        //this.webGlRenderer.shadowMapEnabled = true;
       //this.webGlRenderer.shadowMap  = THREE.BasicShadowMap;
        window.document.body.appendChild(this.webGlRenderer.domElement);
        window.addEventListener('resize', this.ResizeRender, false);
        this.ResizeRender();
        if (this.scene === null) {
            console.log("ERREUR : pas de scéne -> pas de rendu");
            return;
        }

    },
    ResizeRender: function() {
        var self = instal.renderer;
        self.camera.aspect = window.innerWidth / window.innerHeight;
        self.camera.updateProjectionMatrix();
        self.webGlRenderer.setSize(window.innerWidth, window.innerHeight);
    },
    render: function() {
        if (this.scene === null) {
            console.log("pas de scéne -> pas de rendu");
            return;
        }
        this.webGlRenderer.render(this.scene, this.camera);
    },

    updateCameraTarget: function(_camera, _angles) {
        console.log(_angles.angle);

        var lx = Math.sin(_angles.angle);
        var lz = Math.cos(_angles.angle);
        //not implemented yet, set to yangle = 0 CYM
        // var ly = Math.sin(_angles.yangle);
        var ly = Math.sin(0);

        _camera.target.position.set(
            _camera.position.x + lx,
            _camera.position.y + ly,
            _camera.position.z + lz
        );
    }
};