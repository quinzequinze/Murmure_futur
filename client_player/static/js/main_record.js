//////////////////////////SERVER
socket.on('newClient', function(_data) {
	config = _data;
	recorderInit();

});
socket.on('updateSoundNb', function(_data) {
	record.recIndex = _data;
});

socket.on('emitSounds', function(_JSON) {
	for (var i in _JSON) {
		var sound = new Path();
		var x = (view.size.width * (_JSON[i].z / (-1 * config.roomLength))) + delta;
		var y = (view.size.height * (_JSON[i].x / (-1 * config.roomWidth))) + delta;
		sound.add(new Point(x, y));
		// console.log(sound.segments[0].point);
		sound.fullySelected = true;
	};

});

socket.on('removeSound', function(_data) {
	//todo implement clean remove, maybe create a local sound table as in the player code
	console.log(_data);
});

//////////////////////////INIT RECORDER
function recorderInit() {
	socket.emit('getSoundNb');
	recordButton = document.getElementById("record");
	recordButton.onclick = function() {
		record.toggleRecording(this);
	}
	record.initAudio();
	drawScene();
};

//Needed here for paper.js to work.
function drawScene() {
	socket.emit('getSoundNb');
	socket.emit('getSounds');
	var scene = new Path();

	var a = new Point(0 + delta, 0 + delta);
	var b = new Point(0 + delta, view.size.height - delta);
	var c = new Point(view.size.width - delta, view.size.height - delta);
	var d = new Point(view.size.width - delta, 0 + delta);

	scene.add(a);
	scene.add(b);
	scene.add(c);
	scene.add(d);
	scene.closed = true;

	// Select the scene, so we can see its handles:
	scene.fullySelected = true;
};

function onMouseDown(event) {
	console.log(event.point);
	z = ((event.point.x - delta) / view.size.width) * (-1 * config.roomLength);
	x = ((event.point.y - delta) / view.size.height) * (-1 * config.roomWidth);
	var recordButton = document.getElementById("record");
	record.toggleRecording(recordButton);
	console.log("z: " + z);
	console.log("x: " + x);

};

function onMouseUp(event) {
	var recordButton = document.getElementById("record");
	var link = document.getElementById("save");

	record.toggleRecording(recordButton);
	console.log(link);
};