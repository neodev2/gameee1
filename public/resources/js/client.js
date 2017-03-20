var socket = io();

var camera, scene, light, renderer;
var geometry, material, mesh;
var controls;

var objects = [];

var raycaster;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if(havePointerLock){

	var element = document.body;

	var pointerlockchange = function ( event ) {

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

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

	var pointerlockerror = function ( event ) {

		instructions.style.display = '';

	};

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.addEventListener( 'click', function ( event ) {

		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.requestPointerLock();

	}, false );

}else{

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

function init(){

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 0, 750);

	light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
	light.position.set(0.5, 1, 0.75);
	scene.add(light);

	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());

	var onKeyDown = function(event){

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function(event){

		switch( event.keyCode ) {

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

	//raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
	raycaster = new THREE.Raycaster(controls.getObject().position, camera);
	
	createFloor();
	//createObjects();
	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize(){

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(data){
	
	//requestAnimationFrame(animate);
	
	
	// create/move/rotate objects
	
	for(let id in data){
		
		if('_'+socket.id != id){
			
			var child = scene.getObjectByName(id);
		    
			if(child == undefined){
				
				//console.log('object with name "'+id+'" not found in scene. Creating...');
				
				createObject({
					id: id,
					w: data[id].w,
					h: data[id].h,
					d: data[id].d,
					position: {
						x: data[id].position.x,
						y: data[id].position.y,
						z: data[id].position.z
					}
				});
		        
		    }else{
			    
	            child.position.x = data[id].position.x;
	            child.position.y = data[id].position.y;
	            child.position.z = data[id].position.z;
	            
	            //child.rotation.x = data[id].rotation.x;
	            //child.rotation.y = data[id].rotation.y;
	            //child.rotation.z = data[id].rotation.z;
			     
		    }
			
	    }
	    
    }
	
	
	// move camera

	if(controlsEnabled){
		//raycaster.ray.origin.copy( controls.getObject().position );
		//raycaster.ray.origin.y -= 10;

		var intersections = raycaster.intersectObjects(objects);

		//var isOnObject = intersections.length > 0;
		var isOnObject = false;
		
		
		// test add cube on intersection point
		
		/*if(intersections.length > 0){
			geometry = new THREE.BoxGeometry(1, 1, 1);
			material = new THREE.MeshNormalMaterial();
			cubeXXX = new THREE.Mesh(geometry, material);
			scene.add(cubeXXX);
			cubeXXX.position.x = intersections[0].point.x;
			cubeXXX.position.y = intersections[0].point.y;
			cubeXXX.position.z = intersections[0].point.z;
		}*/
		
		// test add line ray
		
		/*for(let i=0; i<intersections.length; i++){
	        //console.log(intersections[i]);
	        
	        var geometry = new THREE.Geometry();
		    geometry.vertices.push(intersections[i].point);
		    geometry.vertices.push(controls.getObject().position);
		    var rayLine = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xFF00FF, linewidth: 2}));
		    scene.add(rayLine);
        }*/
        
        // stop camera when hit an object
        
        if(intersections.length > 0 && intersections[0].distance <= 5){
			
			if(intersections[0].faceIndex == 8 || intersections[0].faceIndex == 9){ // front
				controls.getObject().position.z = intersections[0].point.z+5;
			}
			else if(intersections[0].faceIndex == 10 || intersections[0].faceIndex == 11){ // back
				controls.getObject().position.z = intersections[0].point.z-5;
			}
			else if(intersections[0].faceIndex == 2 || intersections[0].faceIndex == 3){ // left
				controls.getObject().position.x = intersections[0].point.x-5;
			}
			else if(intersections[0].faceIndex == 0 || intersections[0].faceIndex == 1){ // right
				controls.getObject().position.x = intersections[0].point.x+5;
			}
			else if(intersections[0].faceIndex == 4 || intersections[0].faceIndex == 5){ // top
				isOnObject = true;
				//velocity.y = 0;
				//controls.getObject().position.y = intersections[0].point.y-20;
			}
			else if(intersections[0].faceIndex == 6 || intersections[0].faceIndex == 7){ // bottom
				velocity.y = 0;
				//controls.getObject().position.y = intersections[0].point.y-20;
			}
			
		}
		
		
		

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if ( moveForward ) velocity.z -= 400.0 * delta;
		if ( moveBackward ) velocity.z += 400.0 * delta;

		if ( moveLeft ) velocity.x -= 400.0 * delta;
		if ( moveRight ) velocity.x += 400.0 * delta;

		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );

			canJump = true;
		}

		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );

		if ( controls.getObject().position.y < 10 ) {

			velocity.y = 0;
			controls.getObject().position.y = 10;

			canJump = true;

		}

		prevTime = time;

	}
	
	
	socket.emit('position', controls.getObject().position);
	

	renderer.render(scene, camera);

}

function createFloor(){
	
	// floor

	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.rotateX( - Math.PI / 2 );

	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

		var vertex = geometry.vertices[ i ];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;

	}

	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

	}

	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
}

function createObject(data){
	
	geometry = new THREE.BoxGeometry(data.w, data.h, data.d);

	for(let i=0; i<geometry.faces.length; i++){
		var face = geometry.faces[i];
		face.vertexColors[0] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[1] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[2] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
	}

	
	material = new THREE.MeshPhongMaterial({specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors});

	mesh = new THREE.Mesh(geometry, material);
	
	mesh.position.x = data.position.x;
	mesh.position.y = data.position.y;
	mesh.position.z = data.position.z;
	
	scene.add(mesh);

	material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
	
	mesh.name = data.id;
	objects.push(mesh);
	
}

function deleteObject(id){
	
	mesh = scene.getObjectByName(id);
	
    scene.remove(mesh);
    
    for(let i=0; i<objects.length; i++){
        if(objects[i].name == id){
            objects.splice(i, 1);
        }
    }
    
    //console.log(objects);
	
}



socket.on('deleteObject', function(id){
	
	deleteObject(id);
	
});

socket.on('disconnect', function(id){
	console.log(id+' disconnected');
	
	deleteObject(id);
	
});

socket.on('game_update', function(data){
    //console.log(data);
    
    animate(data);
    
});



// fire bullet

document.onclick = function(){
	
	socket.emit('createBullet', {
		id: 'bullet'+Date.now(),
		position: controls.getObject().position,
		direction: controls.getDirection(new THREE.Vector3())
	});
	
}












