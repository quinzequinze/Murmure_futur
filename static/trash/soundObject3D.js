var instal = instal || {};

instal.soundObject3D = function (_filePath, uoid) {
  THREE.Object3D.call( this );
  this.filePath = _filePath;
};

instal.soundObject3D.prototype = Object.create( THREE.Object3D.prototype );

instal.soundObject3D.prototype.functionName = function ( _arg ) {
  var variable = _arg.clone();
};


function getOrientation(Object3D) {
        var matrix = new THREE.Matrix4();
        matrix = matrix.extractRotation(Object3D.matrix);
        var orientation = new THREE.Vector3(0, 0, 1);
        orientation.applyQuaternion( Object3D.quaternion );
        return orientation;
}
/*
    setPosition: function(_x, _y, _z) {
    this.obj.position.set(_x, _y, _z);

        if (!this.AudioContext) {
            console.log("ERREUR : pas d'AudioContext!");
            return;
        }
        this.AudioContext.setPosition(this.sample, this.obj);
    },
    */

