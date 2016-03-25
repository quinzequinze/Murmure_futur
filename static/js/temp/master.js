var instal = instal || {};
instal.master = (function(window, undefined) {
    var status = []
    var color1 = 'rgb(10,10,255)'
    var color2 = 'rgb(10,10,250)'

    function master() {
        var socket = io.connect(root + '/master')
        socket.on('init', init)
        socket.on('updateUser', updateUser)
        socket.on('updateTag', updateTag)

        function init(data) {
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
                tagDiv[i].style.height = 100 / data.TAG_NUMBER + '%'
                if (i % 2 == 0) {
                    tagDiv[i].style.background = color1
                } else {
                    tagDiv[i].style.background = color2
                }
                tagDivContainer.appendChild(tagDiv[i])
            }
        }

        function updateTag(tag) {
            for (var key in tag) {
                tagDiv = document.getElementById('tag' + key)
                posDiv = tagDiv.querySelectorAll('.position');
                var x = 'X : ' + tag[key].x.toFixed(2).toString()
                var y = 'Y : ' + tag[key].y.toFixed(2).toString()
                var z = 'Z : ' + tag[key].z.toFixed(2).toString()
                posDiv[0].innerHTML = x + ", " + y + ", " + z
            }
        }

        function updateUser(user) {
            for (var key in user) {}
        }
        return {}
    }
    return master;
})(window);