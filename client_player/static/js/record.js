var instal = instal || {};
instal.record = {

    audioContext: null,
    audioInput: null,
    realAudioInput: null,
    inputPoint: null,
    audioRecorder: null,
    rafID: null,
    analyserContext: null,
    canvasWidth: null, 
    canvasHeight: null,
    recIndex: 0,


    drawBuffer: function(width, height, context, data) {
        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        context.fillStyle = "silver";
        context.clearRect(0, 0, width, height);
        for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    },

    saveAudio: function() {
        this.audioRecorder.exportWAV(this.doneEncoding);
        // could get mono instead by saying
        // this.audioRecorder.exportMonoWAV( this.doneEncoding );
    },

    gotBuffers: function(buffers) {
        var self = record;
        var canvas = document.getElementById("wavedisplay");

        self.drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);

        // the ONLY time gotBuffers is called is right after a new recording is completed - 
        // so here's where we should set up the download.
        self.audioRecorder.exportWAV(self.doneEncoding);
    },

    doneEncoding: function(blob) {
        var self = record;
        var index = ((self.recIndex < 10) ? "0" : "") + self.recIndex; 
        Recorder.setupDownload(blob, "myRecording" + index + ".wav");
        self.recIndex++;
    },

    toggleRecording: function(e) {
        if (e.classList.contains("recording")) {
            // stop recording
            this.audioRecorder.stop();
            e.classList.remove("recording");
            this.audioRecorder.getBuffers(this.gotBuffers);
        } else {
            // start recording
            if (!this.audioRecorder)
                return;
            e.classList.add("recording");
            this.audioRecorder.clear();
            this.audioRecorder.record();
        }
    },

    convertToMono: function(input) {
        var splitter = this.audioContext.createChannelSplitter(2);
        var merger = this.audioContext.createChannelMerger(2);

        input.connect(splitter);
        splitter.connect(merger, 0, 0);
        splitter.connect(merger, 0, 1);
        return merger;
    },

    cancelAnalyserUpdates: function() {
        window.cancelAnimationFrame(this.rafID);
        this.rafID = null;
    },

    updateAnalysers: function(time) {
        self = record;
        if (!self.analyserContext) {
            var canvas = document.getElementById("analyser");
            self.canvasWidth = canvas.width;
            self.canvasHeight = canvas.height;
            self.analyserContext = canvas.getContext('2d');
        }

        // analyzer draw code here
        {
            var SPACING = 3;
            var BAR_WIDTH = 1;
            var numBars = Math.round(self.canvasWidth / SPACING);
            var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

            analyserNode.getByteFrequencyData(freqByteData);

            self.analyserContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
            self.analyserContext.fillStyle = '#F6D565';
            self.analyserContext.lineCap = 'round';
            var multiplier = analyserNode.frequencyBinCount / numBars;

            // Draw rectangle for each frequency bin.
            for (var i = 0; i < numBars; ++i) {
                var magnitude = 0;
                var offset = Math.floor(i * multiplier);
                // gotta sum/average the block, or we miss narrow-bandwidth spikes
                for (var j = 0; j < multiplier; j++)
                    magnitude += freqByteData[offset + j];
                magnitude = magnitude / multiplier;
                var magnitude2 = freqByteData[i * multiplier];
                self.analyserContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
                self.analyserContext.fillRect(i * SPACING, self.canvasHeight, BAR_WIDTH, -magnitude);
            }
        }

        self.rafID = window.requestAnimationFrame(self.updateAnalysers);
    },

    toggleMono: function() {
        if (this.audioInput != this.realAudioInput) {
            this.audioInput.disconnect();
            this.realAudioInput.disconnect();
            this.audioInput = this.realAudioInput;
        } else {
            this.realAudioInput.disconnect();
            this.audioInput = this.convertToMono(this.realAudioInput);
        }

        this.audioInput.connect(this.inputPoint);
    },

    gotStream: function(stream) {
        var self = record;
        self.inputPoint = self.audioContext.createGain();

        // Create an AudioNode from the stream.
        self.realAudioInput = self.audioContext.createMediaStreamSource(stream);
        self.audioInput = self.realAudioInput;
        self.audioInput.connect(self.inputPoint);

        //    self.audioInput = self.convertToMono( input );

        analyserNode = self.audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        self.inputPoint.connect(analyserNode);

        self.audioRecorder = new Recorder(self.inputPoint);

        zeroGain = self.audioContext.createGain();
        zeroGain.gain.value = 0.0;
        self.inputPoint.connect(zeroGain);
        zeroGain.connect(self.audioContext.destination);
        self.updateAnalysers();
    },

    initAudio: function() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();

        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

        navigator.getUserMedia({
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, this.gotStream, function(e) {
            alert('Error getting audio');
            console.log(e);
        });
    },

    
};