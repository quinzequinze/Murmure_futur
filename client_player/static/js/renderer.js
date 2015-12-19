var instal = instal || {};
instal.renderer = {
    scene: null,
    webGlRenderer: new THREE.WebGLRenderer(),
    camera: new THREE.PerspectiveCamera(45, this.width / this.height, 0.01, 1000),
    setup: function(_scene) {
        //camera

        this.scene=_scene;
        console.log(this.scene.position);
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
};