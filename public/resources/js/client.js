// edits

var socket = io();

//


var camera, scene, renderer;
var geometry, material, mesh;
var controls;
var objects = [];
var raycaster;
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function(event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

            controlsEnabled = true;
            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

        }

    };

    var pointerlockerror = function(event) {

        instructions.style.display = '';

    };

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    instructions.addEventListener('click', function(event) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

    }, false);

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    var onKeyDown = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    //raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
    raycaster = new THREE.Raycaster(controls.getObject().position, camera);

    // floor

    geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    geometry.rotateX(-Math.PI / 2);

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {

        var vertex = geometry.vertices[i];
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;

    }

    for (var i = 0, l = geometry.faces.length; i < l; i++) {

        var face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

    }

    material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // objects

    //...

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
	
	// edits (commented out)
	
    requestAnimationFrame(animate);
    
    //

    if (controlsEnabled) {
	    
	    // edits (commented out)
	    
        /*raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;*/
        
        //

        var intersections = raycaster.intersectObjects(objects);
        
        // edits (test intersections, log, create ray lines)
        
        /*for(let i=0; i<intersections.length; i++){
	        console.log(intersections[i]);
	        
	        var geometry = new THREE.Geometry();
		    geometry.vertices.push(intersections[i].point);
		    geometry.vertices.push(controls.getObject().position);
		    var rayLine = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xFF00FF, linewidth: 2}));
		    scene.add(rayLine);
        }*/
        
        //

        var isOnObject = intersections.length > 0;

        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if (moveForward) velocity.z -= 400.0 * delta;
        if (moveBackward) velocity.z += 400.0 * delta;

        if (moveLeft) velocity.x -= 400.0 * delta;
        if (moveRight) velocity.x += 400.0 * delta;

        if (isOnObject === true) {
            velocity.y = Math.max(0, velocity.y);

            canJump = true;
        }

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);
        
        // edits (collision camera against objects)
        
        var distAmnt = 3;
        if (intersections.length > 0 && intersections[0].distance <= distAmnt) {
			intersections[0].object.material.color.set( 0xff0000 );
			
			// add a test cube in the intersection point
			/*var geometry = new THREE.BoxGeometry(1, 1, 1);
			var material = new THREE.MeshNormalMaterial();
			cubeXXX = new THREE.Mesh(geometry, material);
			scene.add(cubeXXX);
			cubeXXX.position.x = intersections[0].point.x;
			cubeXXX.position.y = intersections[0].point.y;
			cubeXXX.position.z = intersections[0].point.z;*/
			
			//console.log(intersections[0].faceIndex);
			
			if(intersections[0].faceIndex == 8 || intersections[0].faceIndex == 9){ // front
				controls.getObject().position.z = intersections[0].point.z+distAmnt;
			}
			else if(intersections[0].faceIndex == 10 || intersections[0].faceIndex == 11){ // back
				controls.getObject().position.z = intersections[0].point.z-distAmnt;
			}
			else if(intersections[0].faceIndex == 2 || intersections[0].faceIndex == 3){ // left
				controls.getObject().position.x = intersections[0].point.x-distAmnt;
			}
			else if(intersections[0].faceIndex == 0 || intersections[0].faceIndex == 1){ // right
				controls.getObject().position.x = intersections[0].point.x+distAmnt;
			}
			//else if(intersections[0].faceIndex == 4 || intersections[0].faceIndex == 5){ // bottom
			//	velocity.y = 0;
			//	controls.getObject().position.y = intersections[0].point.y-20;
			//}
			
		}
        
        //

        if (controls.getObject().position.y < 10) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

        prevTime = time;
        
        // edits (emit move camera position)
        
        socket.emit('move', {
            x: controls.getObject().position.x,
            y: controls.getObject().position.y,
            z: controls.getObject().position.z
        });
        
        //

    }

    renderer.render(scene, camera);

}


// edits

function fire(){
	
	var pos = controls.getObject().position;
	var dir = new THREE.Vector3();				
	var dir2 = controls.getDirection(dir);
	
	socket.emit('fire', {
        pos: pos,
        dir: dir2,
        weap: 'machinegun'
    });
}

document.onclick = function(){
	fire();
}

socket.on('intervalGameUpdate', function(data) {
    //console.log(data);
    //$('#div1').html( JSON.stringify(data, null, 2) );
    
    //animate();

    // create/move users

    for (let i=0; i<data[0].users.length; i++) {

        if (data[0].users[i].name != socket.id) {

            if (scene.getObjectByName(data[0].users[i].name) == undefined) {

                geometry = new THREE.BoxGeometry(data[0].users[i].w, data[0].users[i].h, data[0].users[i].d);

                for (let i2 = 0; i2 < geometry.faces.length; i2++) {

                    var face = geometry.faces[i2];
                    face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                    face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                    face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

                }

                material = new THREE.MeshPhongMaterial({
                    specular: 0xffffff,
                    shading: THREE.FlatShading,
                    vertexColors: THREE.VertexColors
                });

                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = 0;
                mesh.position.y = 10;
                mesh.position.z = 0;
                mesh.name = data[0].users[i].name;
                scene.add(mesh);

                material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

                objects.push(mesh);
            }


            var xxx = scene.getObjectByName(data[0].users[i].name);
            xxx.position.x = data[0].users[i].x;
            xxx.position.y = data[0].users[i].y;
            xxx.position.z = data[0].users[i].z;

        } else {
            //console.log('skipping same id');
        }

    }
    
    // create/move objects

    for (let i=0; i<data[0].objects.length; i++) {

        //if (data[0].users[i].name != socket.id) {

            if (scene.getObjectByName(data[0].objects[i].name) == undefined) {

                geometry = new THREE.BoxGeometry(data[0].objects[i].w, data[0].objects[i].h, data[0].objects[i].d);

                for (let i2 = 0; i2 < geometry.faces.length; i2++) {

                    var face = geometry.faces[i2];
                    face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                    face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                    face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

                }

                material = new THREE.MeshPhongMaterial({
                    specular: 0xffffff,
                    shading: THREE.FlatShading,
                    vertexColors: THREE.VertexColors
                });

                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = 0;
                mesh.position.y = 10;
                mesh.position.z = 0;
                mesh.name = data[0].objects[i].name;
                scene.add(mesh);

                material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

                objects.push(mesh);
            }


            var xxx = scene.getObjectByName(data[0].objects[i].name);
            xxx.position.x = data[0].objects[i].x;
            xxx.position.y = data[0].objects[i].y;
            xxx.position.z = data[0].objects[i].z;

        //} else {
            //console.log('skipping same id');
        //}

    }

});

socket.on('disconnect', function(data) {
    console.log(data);
    var mesh = scene.getObjectByName(data.id);
    scene.remove(mesh);
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].name == data.id) {
            objects.splice(i, 1);
        }
    }
});

//
