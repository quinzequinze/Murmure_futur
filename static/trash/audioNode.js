function AudioNode(WebAudioContext) {
    this.obj = new THREE.Object3D();
    this.source = "";
    this.AudioContext = WebAudioContext;
}
AudioNode.prototype = {
    setUuid: function(_uuid) {
        this.uuid = _uuid;
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



function addTuto(_soundName) {
    audio.tutoriel = audio.loadSound3D(_soundName + '.m4a', true)
    audio.tutoriel.volume.gain.value = 1
    audio.tutoriel.position = {
        x: randomInt(0, config.ROOM_WIDTH),
        y: randomInt(0, config.ROOM_LENGTH),
        z: 0
    }
    audio.tutoriel.panner.setPosition(audio.tutoriel.position.x, audio.tutoriel.position.y, 0)
    hasTuto = true
}
