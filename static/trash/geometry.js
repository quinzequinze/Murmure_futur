var geometry = {
    light: function() {
        
        var mainLight = new THREE.PointLight(0xcccccc, 1.5, 250);
        mainLight.position.y = 100;
        /*
        var greenLight = new THREE.PointLight(0x00ff00, 0.25, 1000);
        greenLight.position.set(550, 50, 0);
        var redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
        redLight.position.set(-550, 50, 0);
        var blueLight = new THREE.PointLight(0x7f7fff, 0.25, 1000);
        blueLight.position.set(0, 50, 550);
        */
        return {
            mainLight,
         //   redLight,
          //  greenLight,
          //  blueLight,
        };
        //*/
    },
    room: function(_w, _l) {
        var geometry = new THREE.BoxGeometry(_w, 7, _l);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        var box = new THREE.Mesh(geometry, material);
        box.position.y = 0;
        box.position.x = _w / 2;
        box.position.z = _l / 2;
        box.updateMatrixWorld();
        var edges = new THREE.EdgesHelper(box, 0xffffff);
        edges.material.linewidth = 2;
        geometry = new THREE.PlaneGeometry(400,400); 
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            //emissive: 0x444444
        });
        var ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis 
ground.doubleSided = true; 
        ground.castShadow = false;
        ground.receiveShadow = true;
        ground.position.y = -7 / 2 + 0.25;
        ground.position.x = _w / 2;
        ground.position.z = _l / 2;
        return {
            ground,
            edges,
        };
    },
    sound: function() {
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x0000ff,
            //specular: 0xffffff, 
            shininess: 0,
            reflectivity: 10, //side: THREE.DoubleSide
        });
        var sphere = new THREE.Mesh(geometry, material);
        var bluePoint = new THREE.PointLight(0x0033ff, 3, 10);
        bluePoint.add(sphere);
        sphere.add(bluePoint)
        return bluePoint;
    },
    user: function() {
        var geometry = new THREE.SphereGeometry(1, 12, 12);
        var material = new THREE.MeshLambertMaterial({
            color: 0xCC00CC,
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },
}