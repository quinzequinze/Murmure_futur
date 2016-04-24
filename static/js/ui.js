var instal = instal || {}
instal.ui = (function(window, undefined) {
        var light = document.createElement("div")
        light.id = 'light'
        document.body.appendChild(light)
        var mask = document.getElementById('mask')
        mask.style.display = 'none'

        function ui() {
            function wait(boolean) {
                if (boolean) {
                    light.classList.add('wait')
                } else {
                    light.classList.remove('wait')
                }
            }

            function introduction(boolean) {
                if (boolean) {
                    light.classList.add('introduction')
                } else {
                    light.classList.remove('introduction')
                }
            }

            function theme(_boolean) {
                if (_boolean) {
                    light.classList.add('thema')
                } else {
                    light.classList.remove('thema')
                }
            }

            function year(_a) {
                //'rgba(' + 255/_a.step +',255,255 ,' + _a.value + ')'
                if (_a) {
                    light.style.backgroundColor = 'hsl(194,' + Math.floor(_a.value * 100) + '%,' + Math.floor((_a.step * 100) / 4) + '%)'
                } else {
                    light.style.backgroundColor = "black"
                }
            }

            function exploration(_boolean, _sound, _tag) {
                if (!_sound && !_tag) {
                    if (_boolean) {
                        light.classList.add('exploration')
                    } else {
                        light.classList.remove('exploration')
                    }
                } else if (_boolean) {
                    //light.style.backgroundColor = 'hsl(194,' + _sound * 100 + '%,' + _tag * 100 + '%)'
                }
            }

            function beginRecord() {
                console.log('begin')
                light.classList.add('recording')
                light.classList.remove('exploration')
            }

            function endRecord() {
                light.classList.remove('recording')
                light.addEventListener("animationend", function() {
                    console.log('end')
                }, false);
                light.classList.add('exploration')
            }
            return {
                wait: wait,
                introduction: introduction,
                theme: theme,
                year: year,
                exploration: exploration,
                beginRecord: beginRecord,
                endRecord: endRecord
            }
        }
        return ui
    })(window)
    /*
        video = document.createElement('video');
        video.autoplay = true;
        video.loop = true;
        video.crossOrigin = '';
        video.preload = 'auto';
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        video.src = 'video.mp4'
        document.body.appendChild(video)
        */