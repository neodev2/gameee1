const
	express	 = require('express'),
	app		 = express(),
	server	  = require('http').Server(app),
	io		  = require('socket.io')(server);

server.listen(process.env.PORT || 8000);

app.use('/resources', express.static(__dirname+'/public/resources'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
});

/* - - - - - - - - - - - */


var users = {};
var objects = {};

// populate objects

for(let i=0; i<30; i++){
	
	var randomX = ['10', '30', '50', '70', '90', '110', '130', '150'];
	var randomY = ['10', '30', '50'];
	var randomZ = ['10', '30', '50', '70', '90', '110', '130', '150'];
	
	objects['cube'+i] = {
		x: randomX[Math.floor(Math.random()*randomX.length)],
		y: randomY[Math.floor(Math.random()*randomY.length)],
		z: randomZ[Math.floor(Math.random()*randomZ.length)]
	};
	
}



io.on('connection', function(socket){
	
	// on connect
	
	users['_'+socket.id] = {
		w: 20,
		h: 20,
		d: 20,
		position: {
			x: 0,
			y: 10,
			z: 0
		}
		//rotation: {
		//	x: 0,
		//	y: 0,
		//	z: 0
		//}
	};
	
	console.log(users);
	
	
	// on disconnect
	
	socket.on('disconnect', function(){
		
		delete users['_'+socket.id];
		
		io.emit('disconnect', '_'+socket.id);
		
		console.log(users);
		
	});
	
	
	// on action
	
	/*socket.on('x-', function(){
		
		blabla('_'+socket.id, 'x-');
		
	});
	
	socket.on('x+', function(){
		
		blabla('_'+socket.id, 'x+');
		
	});
	
	socket.on('y-', function(){
		
		blabla('_'+socket.id, 'y-');
		
	});
	
	socket.on('y+', function(){
		
		blabla('_'+socket.id, 'y+');
		
	});*/
	
	socket.on('position', function(x, y, z){
		users['_'+socket.id].position.x = x;
		users['_'+socket.id].position.y = y;
		users['_'+socket.id].position.z = z;
	});
	
	socket.on('rotation', function(x, y, z){
		users['_'+socket.id].rotation.x = x;
		users['_'+socket.id].rotation.y = y;
		users['_'+socket.id].rotation.z = z;
	});
	
	
	// create objects
	
	socket.emit('createObjects', objects);
	
	// delete object
	
	socket.on('deleteObject', function(id){
		
		delete objects[id];
		
		io.emit('deleteObject', id);
		
		//console.log(objects);
		
	});
	
	
	// game update interval
	
	var intervalGameUpdate = setInterval(function(){
		socket.emit('game_update', users);
	}, 20);
	
});


/*function blabla(id, type){
	
	for(let i in users){
		if(i != id){
			
			if (users[id].x < users[i].x + users[i].w &&
				users[id].x + users[id].w > users[i].x &&
				users[id].y < users[i].y + users[i].h &&
				users[id].h + users[id].y > users[i].y) {
				//console.log('collision');
				users[id].collision = true;
			}else{
				users[id].collision = false;
			}
			
		}
	}
	
	if(users[id].collision != true){
		
		if(type == 'x-'){
			users[id].x -= 1;
		}
		else if(type == 'x+'){
			users[id].x += 1;
		}
		else if(type == 'y-'){
			users[id].y -= 1;
		}
		else if(type == 'y+'){
			users[id].y += 1;
		}
		
	}else{
		
		// move opposite way (wall reject)
		
		let px = 3;
		
		if(type == 'x-'){
			users[id].x += px;
		}
		else if(type == 'x+'){
			users[id].x -= px;
		}
		else if(type == 'y-'){
			users[id].y += px;
		}
		else if(type == 'y+'){
			users[id].y -= px;
		}
		
	}
	
}*/









