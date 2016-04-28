var instal = instal || {}
instal.map = (function(window, undefined) {
    function map(_container) {
        var display = {}
        var mapElement = document.createElement('div')
        var text = false
        mapElement.id = 'map'
        if (!_container) {
        document.body.appendChild(mapElement)
        text = true
        } else {
          _container.appendChild(mapElement)
        }

        function init() {
            display.tag = []
            display.angle = []
            display.sound = []
            display.theme = []
            for (var i = 1; i <= config.TAG_NUMBER; i++) {
                display.tag[i] = document.createElement("div")
                display.tag[i].id = i
                display.tag[i].classList.add('circle')
                display.tag[i].classList.add('hidden')
                display.tag[i].classList.add('user')
                mapElement.appendChild(display.tag[i])
                if(text){
                display.tag[i].textContent = i
                }
            }
            display.angle = document.createElement("div")
            display.angle.classList.add('circle')
            display.angle.classList.add('angle')
            mapElement.appendChild(display.angle)
        }

        function drawTag() {
            for (var key in display.tag) {
                if (tag[key]) {
                    display.tag[key].classList.remove('hidden')
                    display.tag[key].style.top = webUnit(tag[key]).y + 'px'
                    display.tag[key].style.left = webUnit(tag[key]).x + 'px'
                    if (getMobileOperatingSystem() === 'iOS' && key == TAG_ID) {
                        var px = webUnit(tag[key]).x + 28 * Math.cos(radians(deviceOrientation.angles.alpha))
                        var py = webUnit(tag[key]).y + 28 * Math.sin(radians(deviceOrientation.angles.alpha))
                        display.angle.classList.remove('hidden')
                        display.angle.style.top = py + 'px'
                        display.angle.style.left = px + 'px'
                    }
                } else {
                    display.tag[key].classList.add('hidden')
                }
                if (user[key]) {
                    display.tag[key].classList.add('active')
                } else {
                    display.tag[key].classList.remove('active')
                }
            }
        }

        function drawSound() {
            for (var key in display.sound) {
                display.sound[key].parentNode.removeChild(display.sound[key]);
            }
            display.sound = {}
            for (var key in sound) {
                if (sound[key].status != "censored") {
                    if (!document.getElementById(key)) {
                        display.sound[key] = document.createElement("div")
                        display.sound[key].id = key
                        display.sound[key].classList.add('circle')
                        display.sound[key].classList.add('sound')
                        var normal = {}
                        normal.x = sound[key].x * config.ROOM_WIDTH //UGLY
                        normal.y = sound[key].y * config.ROOM_LENGTH //UGLY
                        display.sound[key].style.top = webUnit(normal).y + 'px'
                        display.sound[key].style.left = webUnit(normal).x + 'px'
                        if (sound[key].status == "valid") {
                            display.sound[key].style.backgroundImage = 'url("valid_sound.svg")';
                        }
                        mapElement.appendChild(display.sound[key])
                    }
                }
            }
        }

        function drawTheme() {
            for (var key in theme.list) {
                display.theme[key] = document.createElement("div")
                display.theme[key].classList.add('circle')
                display.theme[key].classList.add('theme')
                display.theme[key].style.top = webUnit(theme.list[key]).y + 'px'
                display.theme[key].style.left = webUnit(theme.list[key]).x + 'px'
                mapElement.appendChild(display.theme[key])
            }
        }

        function removeTheme() {
            for (var key in display.theme) {
                display.theme[key].parentElement.removeChild(display.theme[key]);
            }
            display.theme = {}
        }

        function webUnit(_tag) {
            var roomW = config.ROOM_WIDTH > config.ROOM_LENGTH ? config.ROOM_WIDTH : config.ROOM_LENGTH
            var roomL = config.ROOM_WIDTH > config.ROOM_LENGTH ? config.ROOM_LENGTH : config.ROOM_WIDTH
            if (mapElement.offsetWidth < mapElement.offsetHeight) {
                return {
                    x: _tag.y * mapElement.offsetWidth / roomL,
                    y: _tag.x * mapElement.offsetHeight / roomW,
                    z: 170,
                    angle: tag.angle
                }
            } else {
                return {
                    x: _tag.x * mapElement.offsetWidth / roomW,
                    y: _tag.y * mapElement.offsetHeight / roomL,
                    z: 170,
                    angle: tag.angle
                }
            }
        }
        return {
            init: init,
            drawTag: drawTag,
            drawSound: drawSound,
            drawTheme: drawTheme,
            removeTheme: removeTheme
        }
    }
    return map
})(window)