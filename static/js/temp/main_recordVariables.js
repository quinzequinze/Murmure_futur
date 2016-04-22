
///////The reason for having those variable separated from the main_record.js
///////is beacause of the need for paper.js to assign scripts as follow:
///////<script type="text/paperscript" src="main_record.js" canvas="canvas"></script>
///////when doing this with the following variable in the the main_record.js
///////it creates an issue in the gotStream: function(stream) in record.js line 144.
///////Probably a better hack should be implemented...

var socket = io.connect();
var record = Object.create(instal.record);
// var soundDispatcher = Object.create(instal.soundDispatcher);
var socket = io.connect();
var config = null;
var x = null;
var z = null;
var delta = 0;

//////////////////////////GLOBAL ROUTINE
function newSound(_filename) {
	var sound = {
		"id": _filename,
		"x": x,
		"y": 0,
		"z": z,
		"directory": _filename
	};
	socket.emit('sendNewSound', sound, _filename);

};




