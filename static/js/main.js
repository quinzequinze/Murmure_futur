 if (TAG_ID == undefined) {
     var TAG_ID = 2;
 }
 var config;
 ///////////////////////////////////////////////////////////////////////////////////////
 //                                                                                   //
 //                                                                                   //
 //                                                                                   // 
 ///////////////////////////////////////////////////////////////////////////////////////
 var client = instal.client()
 var audio = instal.audio()
 client.bind(audio);
 if (getMobileOperatingSystem() != 'iOS') {
     var master = instal.master()
     var renderer = instal.renderer()
     var lps = instal.lps()
     client.bind(master)
     client.bind(renderer)
     client.bind(lps)
 } else {
     document.body.addEventListener('touchstart', function() {
         var msg = 'beginRecord';
         window.webkit.messageHandlers.scriptMessageHandler.postMessage(msg)
         console.log('beginRecord')
     }, false)
     document.body.addEventListener('touchend', function() {
         var msg = 'endRecord'
         console.log('endRecord')
         window.webkit.messageHandlers.scriptMessageHandler.postMessage(msg)
     }, false)
 }
 setInterval(function() {
    if(renderer){
     renderer.camera.position.angle = getAngle(renderer.camera)
     lps.sendPosition(renderer.camera.position)
 }
 }, 1000)

 function getAngle(object) {
     var q = object.quaternion;
     var pVec = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
     angle = Math.atan2(pVec.z, pVec.x);
     angle *= 180 / Math.PI;
     angle = angle > 0 ? angle : angle + 360;
     angle = Math.floor(angle % 360);
     return angle
 }
 console.log(TAG_ID)