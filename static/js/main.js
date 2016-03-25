 //http://patorjk.com/software/taag/#p=display&v=0&f=Block&t=SOMETHING
 const root = 'vigo.local:4000'
 var TAG_ID = TAG_ID || 1;
 var battery, init, config
 var user = {}
 var tag = {}
 var sound = {}
 var audio = instal.audio()
 var ui = instal.ui()
 var socket = io.connect(root + '/client')
 socket.on('init', init)
 socket.on('updateUser', updateUser)
 socket.on('updateTag', updateTag)
 socket.on('updateSound', updateSound)
 socket.on('removeSound', removeSound)
 if (getMobileOperatingSystem() === 'iOS') {
     setInterval(function() {
         updateBattery();
     }, 5000)
 }
 listen()



 function init(_data) {
     config = _data
     socket.emit('requestSession', TAG_ID)
 }

 function updateBattery() {
     window.webkit.messageHandlers.scriptMessageHandler.postMessage('getBattery')
         //socket.emit('updateBattery', TAG_ID)
 }

 function updateTag(_tag) {
     tag = _tag
     if (tag[TAG_ID]) {
         audio.listener.setPosition(tag[TAG_ID].x, tag[TAG_ID].y, tag[TAG_ID].z)
         audio.listener.setOrientation(Math.cos(tag[TAG_ID].angle), 0, Math.sin(tag[TAG_ID].angle), 0, 1, 0);
     }
     ui.clear()
     ui.drawSound(sound)
     ui.drawTag(tag)
     ui.updateInfo()
         //console.log(closestTag())
 }

 function updateUser(_user) {
     user = _user
 }

 function updateSound(_sound) {
     sound = _sound
     //load sound if necessary
     for (var key in sound) {
      if (!audio.sample.hasOwnProperty(key)) {
             audio.sample[key] = audio.loadSound3D(key + '.m4a')
             audio.sample[key].panner.setPosition(sound[key].x, sound[key].y, sound[key].z)
         }
     }
     //remove sound that should not be there anymore
     for (var key in audio.sample) {
         if (!sound.hasOwnProperty(key)) {
             audio.sample[key].randomLooping = false
             audio.sample[key].source.disconnect()
             delete audio.sample[key]
         }
     }
 }

//replace sound in case of re-recording
 function removeSound(_data) {
     clearTimeout(audio.sample[_data].timeOut)
     audio.sample[_data].source.disconnect()
     delete audio.sample[_data]
 }

//upload sound to the server => trigered by the app
 function uploadSound(_buffer) {
     var d = {}
     d.buffer = _buffer.toString().replace(/\s+/g, '').substr(10, _buffer.length - 12)
     d.id = TAG_ID.toString()
     socket.emit('uploadSound', d)
 }

//If a problem occured during the reccording => trigered by the app
 function recordingFail() {
     console.log('recording too short')
 }

 function listen() {
     audio.loadSound('intro.m4a', seek)
 }

 function seek() {
     audio.fadeIn(3)
 }

//returns closest tag id / distance (in m)
 function closestTag() {
     var t = {}
     for (var key in tag) {
         if (key != TAG_ID) {
             var distance = dist(tag[TAG_ID].x, tag[TAG_ID].y, tag[key].x, tag[key].y)
             if (distance < t.dist || typeof t.dist == 'undefined') {
                 t.dist = distance
                 t.id = key
             }
         }
     }
     return t
 }

  function closestSound() {
     let s = {}
     for (var key in sound) {

             var distance = dist(tag[TAG_ID].x, tag[TAG_ID].y, sound[key].x, sound[key].y)
             if (distance < s.dist || typeof s.dist == 'undefined') {
                 s.dist = distance
                 s.id = key
             }
         
     }
     return s
 }
 /*
 var state = {
     listen: function() {},
     seek: function() {},
     explore: function() {
         audio.fadeIn()
     },
     record: function() {
         audio.fadeOut()
     }
 }
 */
 /*
 var confidence = 0
 if (dist(tag[TAG_ID].x, tag[TAG_ID].y, target.x, target.y) < 10) {
     confidence++
     if (confidence > confidenceThreshold) {
         nextStep()
     }
 }
*/