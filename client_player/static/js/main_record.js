var socket = io.connect();
var record = Object.create(instal.record);
//////////////////////////SERVER
socket.on('newClient', function() {
	//
	recorderInit();
});
//////////////////////////RECORDER INIT
function recorderInit() {
	recordButton = document.getElementById("record");
	recordButton.onclick = function() {
		record.toggleRecording(this);
	}
	record.initAudio();
};