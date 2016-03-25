var instal = instal || {};
instal.ui = (function(window, undefined) {
    function ui() {
        var ui = document.createElement('div')
        ui.id = "ui"
        document.body.appendChild(ui)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'debug', false);
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) return;
            if (this.status !== 200) return; // or whatever error handling you want
            ui.innerHTML = this.responseText;
        };
        xhr.send();
        //
        var canvas = document.getElementById('canvas')
        var recordWarp = document.getElementById('recordWarp')
        var mapWarp = document.getElementById('mapWarp')
        var infoWarp = document.getElementById('infoWarp')
        var infoButton = document.getElementById('infoButton')
        var mapButton = document.getElementById('mapButton')
        var recordButton = document.getElementById('recordButton')
        var uuidField = document.getElementById('uuidField')
        var sampleField = document.getElementById('sampleField')
        var batteryField = document.getElementById('batteryField')
        var positionField = document.getElementById('positionField')
        var tagField = document.getElementById('tagField')
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
            //
            /*
            _|_|_|_|  _|      _|  _|_|_|_|  _|      _|  _|_|_|_|_|    _|_|_|  
            _|        _|      _|  _|        _|_|    _|      _|      _|        
            _|_|_|    _|      _|  _|_|_|    _|  _|  _|      _|        _|_|    
            _|          _|  _|    _|        _|    _|_|      _|            _|  
            _|_|_|_|      _|      _|_|_|_|  _|      _|      _|      _|_|_|    
            */
        recordButton.addEventListener("touchend", function() {
            recordButton.classList.add("selected")
            recordWarp.classList.remove("hidden")
            infoWarp.classList.add('hidden')
            infoButton.classList.remove('selected')
            mapWarp.classList.add('hidden')
            mapButton.classList.remove('selected')
            event.preventDefault();
        }, false); //
        mapButton.addEventListener("touchend", function() {
            mapButton.classList.add("selected")
            mapWarp.classList.remove("hidden")
            infoWarp.classList.add('hidden')
            infoButton.classList.remove('selected')
            recordWarp.classList.add('hidden')
            recordButton.classList.remove('selected')
            event.preventDefault();
        }, false); //
        infoButton.addEventListener("touchend", function() {
            infoButton.classList.add("selected")
            infoWarp.classList.remove("hidden")
            recordWarp.classList.add('hidden')
            recordButton.classList.remove('selected')
            mapWarp.classList.add('hidden')
            mapButton.classList.remove('selected')
            event.preventDefault();
        }, false);
        /*                               
        _|      _|    _|_|    _|_|_|    
        _|_|  _|_|  _|    _|  _|    _|  
        _|  _|  _|  _|_|_|_|  _|_|_|    
        _|      _|  _|    _|  _|        
        _|      _|  _|    _|  _|        
        */
        canvas.addEventListener("touchstart", touchStart, false)
        canvas.addEventListener("touchmove", touchmove, false)
        var target = {
            x: 0,
            y: 0,
            a: 0
        }
        obj = {
            x: 0,
            y: 0,
            r: 50,
            a: 0
        };

        function clear() {
            var ctx = document.getElementById("canvas").getContext('2d');
            ctx.fillStyle = '#F3EFE0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawTag(tag) {
            for (var key in tag) {
                var canvasPos = canvasUnit(tag[key])
                var ctx = document.getElementById("canvas").getContext('2d');
                ctx.fillStyle = "rgb(0,0,255)";
                ctx.beginPath();
                //ctx.arc(tag[key].x, tag[key].y, obj.r, 0, Math.PI * 2, true);
                ctx.arc(canvasPos.x, canvasPos.y, obj.r, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                canvasPos.angle //= degrees(canvasPos.angle)
                var px = canvasPos.x + 80 * Math.cos(canvasPos.angle);
                var py = canvasPos.y + 80 * Math.sin(canvasPos.angle);
                ctx.beginPath();
                ctx.arc(px, py, 10, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                ctx.font = 'lighter 32pt mark';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(key, canvasPos.x, canvasPos.y + 16);
            }
        }

        function canvasUnit(_tag) {
            //return _tag
            return {
                x: _tag.x * canvas.width / 3.8,
                y: _tag.y * canvas.height / 5.6,
                z: 170,
                angle: _tag.angle
            }
        }

        function drawSound(sound) {
            for (var key in sound) {
                var ctx = document.getElementById("canvas").getContext('2d');
                var c = 8
                for (var i = 1; i <= c; i++) {
                    var canvasPos = canvasUnit(sound[key])
                    ctx.strokeStyle = "rgba(0,0,0," + (1 - (i / c)) + ")"
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(canvasPos.x, canvasPos.y, obj.r * 1.2 * i / 3 * 1.3, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }

        function touchStart(event) {
            var touch = event.targetTouches[0];
            target.x = touch.pageX
            target.y = touch.pageY
            event.preventDefault();
        }

        function touchmove(event) {
            var touch = event.targetTouches[0];
            target.x = touch.pageX
            target.y = touch.pageY
            event.preventDefault();
        }

        function move() {
            var x = obj.x - target.x
            var y = obj.y - target.y
            var dist = Math.sqrt(x * x + y * y);
            var velX = (-x / dist) * 10;
            var velY = (-y / dist) * 10;
            if (dist > 10) {
                obj.x += velX
                obj.y += velY
            }
            obj.a = Math.atan2(-y, -x);
        }
        /*
         _|_|_|    _|_|_|_|    _|_|_|    _|_|    _|_|_|    _|_|_|    _|_|_|_|  _|_|_|    
         _|    _|  _|        _|        _|    _|  _|    _|  _|    _|  _|        _|    _|  
         _|_|_|    _|_|_|    _|        _|    _|  _|_|_|    _|    _|  _|_|_|    _|_|_|    
         _|    _|  _|        _|        _|    _|  _|    _|  _|    _|  _|        _|    _|  
         _|    _|  _|_|_|_|    _|_|_|    _|_|    _|    _|  _|_|_|    _|_|_|_|  _|    _| 
        */
        recorder.addEventListener("touchstart", function() {
            window.webkit.messageHandlers.scriptMessageHandler.postMessage('beginRecord')
            recorder.classList.add('recording')
            event.preventDefault();
        }, false);
        recorder.addEventListener("touchend", function() {
            window.webkit.messageHandlers.scriptMessageHandler.postMessage('endRecord')
            recorder.classList.remove('recording')
            event.preventDefault();
        }, false);
        /*
         _|_|_|  _|      _|  _|_|_|_|    _|_|      _|_|_|  
           _|    _|_|    _|  _|        _|    _|  _|        
           _|    _|  _|  _|  _|_|_|    _|    _|    _|_|    
           _|    _|    _|_|  _|        _|    _|        _|  
         _|_|_|  _|      _|  _|          _|_|    _|_|_|    
        */
        setInterval(function() {
            move()
            if (typeof lps !== "undefined") {
                lps.sendPosition({
                    id: TAG_ID,
                    x: obj.x,
                    y: obj.y,
                    z: 0,
                    angle: obj.a
                })
            }
        }, 400)

        function updateInfo() {
            tagField.textContent = TAG_ID
            uuidField.textContent = user[TAG_ID];
            uuidField.textContent = user[TAG_ID];
            if(tag[TAG_ID]){
            positionField.textContent = 'x : ' + parseFloat(tag[TAG_ID].x).toFixed(1) + ' y : ' + parseFloat(tag[TAG_ID].y).toFixed(1) + ' a : ' + degrees(parseFloat(tag[TAG_ID].angle)).toFixed(1)
            }
            if (battery) {
                batteryField.textContent = Math.round(battery * 100) + '%'
            }
            if (sound[user[TAG_ID]]) {
                sampleField.textContent = 'true';
            }
        }
        return {
            updateInfo: updateInfo,
            drawSound: drawSound,
            drawTag: drawTag,
            clear: clear
        }
    }
    return ui;
})(window);