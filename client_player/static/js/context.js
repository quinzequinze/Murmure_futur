var instal = instal || {};
instal.context = {
    userNodeArray: [],
    camera: new THREE.PerspectiveCamera(45, this.width / this.height, 0.01, 1000), // Needed beacuse Three.js ojects over node are not performing correcly, CYM
    soundNodeArray: [],
    scene: new THREE.Scene(),
    clock: new THREE.Clock(true),
    sound: Object.create(instal.sound),
    renderer: null,
    render: true,
    userId: null,
    init: function(_myId) {

        var dir = new THREE.Vector3(1, 0, 0);
        var origin = new THREE.Vector3(0, 0, 0);
        var length = 1;
        var hex = 0xffff00;
        var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);

        this.camera.target = new THREE.Object3D();
        //Initialize the userNodeArray table from the server
        socket.emit('getUsers');

        this.scene.add(arrowHelper);
        this.userId = _myId;
        this.sound.setup();
        if (this.render) {
            this.renderer = Object.create(instal.renderer);
            this.renderer.setup(this.scene, this.camera);
            this.room(-10, -20);
        }
    },
    room: function(_w, _l) {

        var geometry = new THREE.BoxGeometry(_w, 7, _l);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        var object = new THREE.Mesh(geometry, material);
        object.position.y = 0;
        object.position.x = -_w / 2;
        object.position.z = -_l / 2;

        object.updateMatrixWorld();

        var edges = new THREE.EdgesHelper(object, 0xffffff);
        edges.material.linewidth = 2;
        this.scene.add(edges);

        //ground
        geometry = new THREE.BoxGeometry(_w, 0.5, _l);
        material = new THREE.MeshBasicMaterial({
            color: 0xcccccc
        });
        var ground = new THREE.Mesh(geometry, material);
        ground.castShadow = false;
        ground.receiveShadow = true;
        ground.position.y = -7 / 2 + 0.25;
        ground.position.x = -_w / 2;
        ground.position.z = -_l / 2;
        this.scene.add(ground);
        //lights
        var mainLight = new THREE.PointLight(0xcccccc, 1.5, 250);
        mainLight.position.y = 7;
        this.scene.add(mainLight);
        var greenLight = new THREE.PointLight(0x00ff00, 0.25, 1000);
        greenLight.position.set(550, 50, 0);
        this.scene.add(greenLight);
        var redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
        redLight.position.set(-550, 50, 0);
        this.scene.add(redLight);
        var blueLight = new THREE.PointLight(0x7f7fff, 0.25, 1000);
        blueLight.position.set(0, 50, 550);
        this.scene.add(blueLight);
    },
    addSoundNode: function(_id, _path, _x, _y) {
        var audioNode = new AudioNode(this.sound); //il faut passer le soundContext à l'objet audioNode
        audioNode.loadSound(_path);
        audioNode.setPosition(0, 0, 0);
        if (this.render) {
            audioNode.makeMesh();
        }
        if (this.soundNodeArray[_id]) {
            console.log("cet audioNode existe deja");
            return;
        }
        audioNode.obj.name = _id;
        audioNode.id = _id;
        this.soundNodeArray[_id] = audioNode;
        this.scene.add(audioNode.obj);
        // console.log(audioNode)
        // console.log(audioNode.obj.position);
    },
    removeSoundNode: function(_id) {
        if (!soundNodeArray[id]) {
            console.log("cette audioNode n'existe pas")
            return;
        }
        this.soundNodeArray[id] = null;
        scene.remove(getObjectByName(_id));
    },
    updateUsers: function(_JSON) {
        this.userNodeArray = _JSON;

        nbUser = _JSON.length;
        
        var camera = this.camera;
        this.updateUserTarget(camera, _JSON[this.userId]);

        camera.lookAt(camera.target.position);

        camera.position.set(
            _JSON[this.userId].x,
            _JSON[this.userId].y,
            _JSON[this.userId].z);
        this.sound.setListener(camera);

    },
    updateSounds: function(_JSON) {},


    updateUserTarget: function(_camera, _angles) {
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
    },

    updateRender: function() {
        if (this.render = true) {
            // this.sound.setListener(context.renderer.camera);
            this.renderer.render();
            //  console.log(context.renderer.camera.position);
        }

    },
};