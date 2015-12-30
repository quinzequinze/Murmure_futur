///debug
var debugMode = false;
var keyBoardDebug = (getMobileOperatingSystem() == "unknown"); //Automatic detection of mobil devices: CYM
///globals
var context, debug = null,
    idSelect;
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

    if (context) {
        context.updateUsers(data);
    }

});

socket.on('emitSound', function(data) {
    context.updateSounds(data);
});

socket.on('closeClient', function(data) {
    window.close();
});

//////////////////////////MANUAL ACTIONS

//Press 'D' to start debugging from a station
window.addEventListener('keydown', function(ev) {
    switch (ev.keyCode) {
        case 'D'.charCodeAt(0):
            if (debugMode) {
                debugMode = false;
                delete debug;
                debugHandler();
            } else {
                debugMode = true;
                debugHandler();
            };

            break;
        case 'R'.charCodeAt(0):
            if (context.render) {
                context.render = false;
                // delete debug;
                renderHandler();
            } else {
                context.render = true;
                renderHandler();
            };

            break;
    }
}, false);



//////////////////////////DEBUG
function debugHandler() {
    if (debugMode && (debug == null)) {
        if (keyBoardDebug) {
            window.alert("Debug enabled!");
            debug = Object.create(instal.debug);
        } else {
            window.alert("Debug mobil enabled!");
            debug = Object.create(instal.mobilDebug);
        }
        debug.setup();
        debug.clock = context.clock;
    } else {
        if (debug != null) {
            window.alert("Debug object already created!");
        };
        if (!debugMode) {
            window.alert("Debug not enabled!");
        };

    };

}

//////////////////////////RENDER
function renderHandler() {
    if (context.render && (context.renderer == null)) {

        window.alert("Renderer enabled!");
        context.renderer = Object.create(instal.renderer);
        context.renderer.setup(context.scene, context.camera);
        context.room(-10, -20);

    } else {
        if (context.renderer != null) {
            window.alert("Renderer object already created!");
        };
        if (!context.render) {
            window.alert("Renderer not enabled!");
        };

    };

}

//////////////////////////ID_SELECT
function idSelectInit() {
    idSelect = Object.create(instal.idSelect);
    idSelect.buttonGrid(nbUser, startPlayer);

    window.addEventListener("resize", function() {
        console.log("la");
        if (!context) {
            idSelect.destroy();
            idSelect.buttonGrid(nbUser, startPlayer);
        } else {
            if (context.renderer) {
                context.renderer.ResizeRender();
            };
        }

    });
}
//////////////////////////PLAYER
function startPlayer(_id) {

    // - envoi de l'id au serveur / ---> le slot est occupé / le slot n'est pas disponible / le slot est en debug

    console.log("** player started, userId:  " + _id);
    context = Object.create(instal.context);
    context.init(_id);

    //context.renderer = false;
    // context.render = true;
    // - control devient debug, add event listener sur 'd' pour focer le debug
    debugHandler()
        //
    var path = nf(1, 2) + ".mp3"
    context.addSoundNode(1, path);
    // console.log(instal);
    loop();
}

function loop() {
    requestAnimationFrame(loop);
    if (context.renderer) {
        context.updateRender();
    }
    if (debugMode) {
        debug.moveCamera(context.camera);
    };

    //Move camera is responsible for calculating the position from the keyboard action
    //Only used if in debug mode CYM

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