var socket = io.connect();
var record = Object.create(instal.record);
var socket = io.connect();
var config = null;


function newSound(_filename) {
	var sound = {
		"id": _filename,
		"x": randomInt(0, config.roomWidth * -1),
		"y": 0,
		"z": randomInt(0, config.roomLength * -1),
		"directory": _filename
	};

	// sounds[index].  = ;
    // 

	window.setTimeout(
		socket.emit('sendNewSound', sound, _filename), 5000);

}

//////////////////////////SERVER
socket.on('newClient', function(_data) {
	config = _data;
	recorderInit();

});
socket.on('updateSoundNb', function(_data) {
	record.recIndex = _data;
});
//////////////////////////RECORDER INIT
function recorderInit() {
	socket.emit('getSoundNb');
	recordButton = document.getElementById("record");
	recordButton.onclick = function() {
		record.toggleRecording(this);
	}
	record.initAudio();
};