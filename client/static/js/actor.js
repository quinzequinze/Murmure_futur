function AudioNode(AudioContext) {
    this.obj = new THREE.Object3D();
    this.source = "";
    this.AudioContext = AudioContext; //soundContext
    this.sample = null;
}
AudioNode.prototype = {
    setId: function(_id) {
        this.id = _id;
    },
    setPosition: function(_x, _y, _z) {
        this.obj.position.set(_x, _y, _z);

        if (!this.AudioContext) {
            console.log("ERREUR : pas d'AudioContext!");
            return;
        }
        this.AudioContext.setPosition(this.sample, this.obj);
    },
    getPosition: function() {
        return this.obj.position;
    },
    getOrientation: function() {
        var matrix = new THREE.Matrix4();
        matrix.extractRotation(this.obj.matrix);
        var orientation = new THREE.Vector3(0, 0, 1);
        orientation = matrix.multiplyVector3(direction);
        return orientation;
    },
    makeMesh: function() {

        var geometry = new THREE.SphereGeometry(1, 32, 32);

        var material = new THREE.ShaderMaterial({

            uniforms: context.uniforms1,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragment_shader1').textContent

        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.obj.add(mesh);
    },
    loadSound: function(_source) {
        if (!this.AudioContext) {
            console.log("ERREUR : pas de sample charger");
            return;
        }
        this.source = _source;
        this.sample = this.AudioContext.loadSound(this.source);
        //this.setPositionAndVelocity(this, this.sample.panner);
        //this.createSoundCone(audioNode, 1.0, 3.8, 0.1);
    },
};