//bypass for debug
var instal = instal || {};
instal.master = (function(window, undefined) {
    var status = []
    var color1 = '#364554'
    var color2 = '#303948'

    function master() {
        //var socket = io.connect('vigo.local:4000/master')
        //socket.on('updateUsers', updateUsers)
        //socket.on('requestSession', resquestSession)
        ///////////////////////////////////////////////////////////////////////////////////////
        //                                                                                   //
        //                                                                                   //
        //                                                                                   // 
        ///////////////////////////////////////////////////////////////////////////////////////
        function newConfig(data) {
            initInfos(data);
        }

        function initInfos(data) {
            var infoDiv = document.createElement('div')
            infoDiv.id = 'infos'
            var tagDivContainer = document.createElement('div')
            tagDivContainer.id = 'tags'
            infoDiv.appendChild(tagDivContainer)
            document.body.appendChild(infoDiv)
            var tagDiv = []
            for (var i = 0; i < data.TAG_NUMBER; i++) {
                tagDiv[i] = document.createElement('div')
                tagDiv[i].id = 'tag' + i
                tagDiv[i].className = 'tag'
                var nameDiv = document.createElement('div')
                nameDiv.className = 'name'
                nameDiv.innerHTML = i
                tagDiv[i].appendChild(nameDiv)
                var positionDiv = document.createElement('div')
                positionDiv.className = 'position'
                positionDiv.innerHTML = '. . .'
                tagDiv[i].appendChild(positionDiv)
                    //tagDiv[i].innerHTML = 'no data'
                tagDiv[i].style.height = 100 / data.TAG_NUMBER + '%'
                if (i % 2 == 0) {
                    tagDiv[i].style.background = color1
                } else {
                    tagDiv[i].style.background = color2
                }
                tagDivContainer.appendChild(tagDiv[i])
            }
        }

        function updateInfos(data) {
            for (var i in data) {
                if (data[i]) {
                    tagDiv = document.getElementById('tag' + i)
                    console.log(tagDiv)
                    posDiv = tagDiv.querySelectorAll('.position');
                    var x = 'X : ' + data[i].position.x.toFixed(2).toString()
                    var y = 'Y : ' + data[i].position.y.toFixed(2).toString()
                    var z = 'Z : ' + data[i].position.z.toFixed(2).toString()
                    posDiv[0].innerHTML =  x +", "+ y+", "+ z
                }
            }
        }

        function updateUsers(data) {
            //  console.log(data)
            updateInfos(data)
        }

        function resquestSession(data) {
            console.log("master | tag #" + data + " pending...")
        }

        function initSounds(data) {}
        return {
            initSounds: initSounds,
            newConfig: newConfig,
            updateUsers: updateUsers
        }
    }
    return master;
})(window);