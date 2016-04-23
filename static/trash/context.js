var instal = instal || {};
instal.context = {
    users: [],
    soundNodeArray: [],
    sounds: [],
    scene: new THREE.Scene(),
    clock: new THREE.Clock(true),
    sound: Object.create(instal.sound),
    userId: null,
    roomWidth: null,
    roomLength: null,

    init: function(_Id) {
        this.userId = _Id;
        //renderHandler();
    },
    addSoundNode: function(_id, _path, _x, _z) {
        var audioNode = new AudioNode(this.sound); //il faut passer le soundContext à l'objet audioNode
        audioNode.loadSound(_path);
        audioNode.setPosition(_x, 0, _z);
        audioNode.obj.name = _id;
        audioNode.id = _id;
        this.soundNodeArray[_id] = audioNode;
        this.scene.add(audioNode.obj);
    },
    removeSoundNode: function(_id) {
        if (!this.soundNodeArray[_id]) {
            console.log("cette audioNode n'existe pas")
            return;
        }
        // this.soundNodeArray[_id] = null;
        // console.log(this.scene.getObjectByName(_id));
        // console.log(this.soundNodeArray[_id]);
        ////TODO
        //Remove 3D Obj
        this.scene.remove(context.soundNodeArray[_id].obj);
        //Remove Sound source
        this.soundNodeArray[_id].sample.source.disconnect();
        delete this.soundNodeArray[_id];
    },
    updateUsers: function(_JSON) {
        this.userNodeArray = _JSON;
        camera.lookAt(camera.target.position);

        camera.position.set(
            _JSON[this.userId].x,
            _JSON[this.userId].y,
            _JSON[this.userId].z);
        this.sound.setListener(camera);


    },

    updateSounds: function(_JSON) {

        for (var i in _JSON) {
            console.log(_JSON)
            if (Object.keys(_JSON).length != 0)
            {
                if (!this.soundNodeArray[i]) {
                    this.addSoundNode(i,i,_JSON[i].x,_JSON[i].z);
                };
            }
            
        };

    },
};