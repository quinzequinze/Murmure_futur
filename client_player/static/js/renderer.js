var instal = instal || {};
instal.renderer = {
    scene: null,
    camera: null,
    webGlRenderer: new THREE.WebGLRenderer(),
    
    setup: function(_scene,_camera) {
        //camera

        this.scene =_scene;
        this.camera =_camera;
        // console.log(this.scene.position);
        this.camera.position.x = this.scene.position.x;
        this.camera.position.z = this.scene.position.z;
        this.camera.position.y = 0;
        // this.camera.target = new THREE.Object3D();
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
        var self = this;
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