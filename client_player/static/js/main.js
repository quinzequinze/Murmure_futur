///debug
var keyBoardControl = true;
///globals
var context, control, idSelect;
var roomWidth, roomLength, nbUser, userId, soundData, userData;
var config;
var hasConfig = false;
//node
var socket = io.connect();
//ptit check 
if (typeof Object.create !== "function") {
    Object.create = function(o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}
//////////////////////////SERVER
socket.on('newClient', function(data) {
    config = data;
    nbUser = config.nbUserServer;
    roomWidth = config.roomWidth;
    roomLength = config.roomLength;
    console.table(config);
    //
    idSelectInit();
});
socket.on('emitUsers', function(data) {
context.updateUser(data);
});

socket.on('emitSound', function(data) {
context.updateSound(data);
});
//////////////////////////ID_SELECT
function idSelectInit() {
    idSelect = Object.create(instal.idSelect);
    idSelect.buttonGrid(nbUser, startPlayer);
    // 
    window.addEventListener("resize", function() {
        idSelect.destroy();
        idSelect.buttonGrid(nbUser, startPlayer);
    });
}
//////////////////////////PLAYER
function startPlayer(_id) {
    console.log("** player started, userId: " + _id);
    context = Object.create(instal.context);
    context.init(_id);
    //context.renderer = false;
    context.render = true;
    //
    if (keyBoardControl) {
        control = Object.create(instal.control);
    } else {
        control = Object.create(instal.mobilControl);
    }
    control.setup();
    control.clock = context.clock;
    //
        var path = nf(1, 2) + ".mp3"
    context.addSoundNode(1, path);
    console.log(instal);
    loop();
}

function loop() {
   requestAnimationFrame(loop);
    if(context.renderer){
    context.updateRender();
}
    ///FONCTION À L'ÉTUDE
    /*
    for (var i = 0; i < context.soundNodeArray.length; i++) {
        if (context.soundNodeArray[i]) {
            var angle = getAngleTo(context.renderer.camera, context.soundNodeArray[i].obj);
            var mapedLowPass = mapVar(angle, 180, 0, 100, 10000);
            context.soundNodeArray[i].sample.biquadFilter.frequency.value = mapedLowPass;
        }
    }
    */
}