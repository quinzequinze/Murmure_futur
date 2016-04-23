var instal = instal || {}
instal.ui = (function(window, undefined) {
        var light = document.createElement("div")
        light.id = 'light'
        document.body.appendChild(light)

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

            function theme(boolean) {
                if (boolean) {
                    light.classList.add('thema')
                } else {
                    light.classList.remove('thema')
                }
            }

            function year(_a) {
 //'rgba(' + 255/_a.step +',255,255 ,' + _a.value + ')'
            	light.style.backgroundColor =  'hsl(194,' +Math.floor(_a.value*100)+'%,'+ Math.floor((_a.step * 100)/4)+'%)'
            }

            function exploration() {

            	
            }
            return {
                wait: wait,
                introduction: introduction,
                theme: theme,
                year: year,
                exploration: exploration
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