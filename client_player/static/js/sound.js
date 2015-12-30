var instal = instal || {};
instal.sound = {
    play: function() {
        this.playing = true;
        this.audio.volume.connect(this.audio.context.destination);
    },
    stop: function() {
        this.playing = false;
        this.audio.volume.disconnect();
    },
    setup: function() {
        var self = this;
        var a = {};
        this.audio = a;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        a.context = new AudioContext();
        a.convolver = a.context.createConvolver();
        a.volume = a.context.createGain();
        a.mixer = a.context.createGain();
        a.flatGain = a.context.createGain();
        a.convolverGain = a.context.createGain();
        a.destination = a.mixer;
        a.mixer.connect(a.flatGain);
        a.mixer.connect(a.convolver);
        a.convolver.connect(a.convolverGain);
        a.flatGain.connect(a.volume);
        a.convolverGain.connect(a.volume);
        a.volume.connect(a.context.destination);


        window.addEventListener('blur', function(ev) {
            self.stop()
        }, false);
        window.addEventListener('focus', function(ev) {
            self.play()
        }, false);
    },
    createSoundCone: function(object, innerAngle, outerAngle, outerGain) {
        var innerScale = 1,
            outerScale = 1;
        var ia = innerAngle;
        var oa = outerAngle;
        if (outerAngle > Math.PI) {
            oa = 2 * Math.PI - outerAngle;
            outerScale = -1;
        }
        if (innerAngle > Math.PI) {
            ia = 2 * Math.PI - innerAngle;
            innerScale = -1;
        }
        var height = 5;
        var innerRadius = Math.sin(ia / 2) * height;
        var innerHeight = Math.cos(ia / 2) * height;
        var outerRadius = Math.sin(oa / 2) * height * 0.9;
        var outerHeight = Math.cos(oa / 2) * height * 0.9;
        object.sound.panner.coneInnerAngle = innerAngle * 180 / Math.PI;
        object.sound.panner.coneOuterAngle = outerAngle * 180 / Math.PI;
        object.sound.panner.coneOuterGain = outerGain;
    },
    setPosition: function(sample, object) {
        // console.log(object);
        var q = new THREE.Vector3();
        object.updateMatrixWorld();
        q.setFromMatrixPosition(object.matrixWorld);

        sample.panner.setPosition(q.x, q.y, q.z);
        //orientation
        var m = object.matrix;
        var mx = m.elements[12],
            my = m.elements[13],
            mz = m.elements[14];
        m.elements[12] = m.elements[13] = m.elements[14] = 0;
        //devant
        var vec = new THREE.Vector3(0, 0, 1);
        vec.applyProjection(m);
        vec.normalize();
        //dessu
        var up = new THREE.Vector3(0, -1, 0);
        up.applyProjection(m);
        up.normalize();
        sample.panner.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);
        m.elements[12] = mx;
        m.elements[13] = my;
        m.elements[14] = mz;
    },
    setListener: function(object) {
        object.updateMatrixWorld();
        //position
        var q = new THREE.Vector3();

        q.setFromMatrixPosition(object.matrixWorld);

        this.audio.context.listener.setPosition(q.x, q.y, q.z);

        //orientation

        var m = object.matrix;
        var mx = m.elements[12],
            my = m.elements[13],
            mz = m.elements[14];
        m.elements[12] = m.elements[13] = m.elements[14] = 0;
        //devant
        var vec = new THREE.Vector3(0, 0, 4);
        vec.applyProjection(m);
        vec.normalize();
        //dessu
        var up = new THREE.Vector3(0, -1, 0);
        up.applyProjection(m);
        up.normalize();

        this.audio.context.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);

        m.elements[12] = mx;
        m.elements[13] = my;
        m.elements[14] = mz;

    },
    loadEnvironment: function(name) {
        var self = this;
        this.loadBuffer('impulse_responses/' + name + '.wav', function(buffer) {
            self.audio.environments[name] = buffer;
        });
    },
    loadBuffer: function(soundFileName, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", soundFileName, true);
        request.responseType = "arraybuffer";
        var ctx = this.audio.context;
        request.onload = function() {
            ctx.decodeAudioData(request.response, callback, function() {
                alert("Decoding the audio buffer failed");
            });
        };
        request.send();
        return request;
    },
    loadSound: function(soundFileName) {
        var ctx = this.audio.context;
        var sound = {};
        sound.source = ctx.createBufferSource();
        sound.source.loop = true;
        sound.panner = ctx.createPanner();
        sound.volume = ctx.createGain();
        sound.biquadFilter = ctx.createBiquadFilter();
        //param le filtre
        sound.biquadFilter.type = "lowpass";
        sound.biquadFilter.frequency.value = 10000;
        //sound.biquadFilter.gain.value = -10;
        //conecter les nodes 
        sound.source.connect(sound.volume);
        sound.volume.connect(sound.biquadFilter);
        sound.biquadFilter.connect(sound.panner);
        sound.panner.connect(this.audio.destination);
        this.loadBuffer(soundFileName, function(buffer) {
            sound.buffer = buffer;
            sound.source.buffer = sound.buffer;
            sound.source.start(0);
        });
        return sound;
    },

};