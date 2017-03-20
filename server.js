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


var objects = {};

// populate objects

for(let i=0; i<30; i++){
	
	var randomX = ['10', '30', '50', '70', '90', '110', '130', '150'];
	var randomY = ['10', '30', '50'];
	var randomZ = ['10', '30', '50', '70', '90', '110', '130', '150'];
	
	objects['cube'+i] = {
		w: 20,
		h: 20,
		d: 20,
		position: {
			x: randomX[Math.floor(Math.random()*randomX.length)],
			y: randomY[Math.floor(Math.random()*randomY.length)],
			z: randomZ[Math.floor(Math.random()*randomZ.length)]
		}
	};
	
}



io.on('connection', function(socket){
	
	// on connect
	
	objects['_'+socket.id] = {
		w: 20,
		h: 20,
		d: 20,
		position: {
			x: 0,
			y: 10,
			z: 0
		}
	};
	
	//console.log(objects);
	
	
	// on disconnect
	
	socket.on('disconnect', function(){
		
		delete objects['_'+socket.id];
		
		io.emit('disconnect', '_'+socket.id);
		
		//console.log(objects);
		
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
	
	socket.on('position', function(data){
		objects['_'+socket.id].position.x = data.x;
		objects['_'+socket.id].position.y = data.y;
		objects['_'+socket.id].position.z = data.z;
	});
	
	
	// delete object
	
	socket.on('deleteObject', function(id){
		
		delete objects[id];
		
		io.emit('deleteObject', id);
		
		//console.log(objects);
		
	});
	
	
	// create bullet
	
	socket.on('createBullet', function(data){
		
		objects[data.id] = {
			w: 1,
			h: 1,
			d: 1,
			position: {
				x: data.position.x,
				y: data.position.y,
				z: data.position.z
			},
			direction: {
				x: data.direction.x,
				y: data.direction.y,
				z: data.direction.z
			}
		};
		
		// move bullet
		
		var interval = setInterval(function(){
			objects[data.id].position.x += objects[data.id].direction.x * 2;
			objects[data.id].position.y += objects[data.id].direction.y * 2;
			objects[data.id].position.z += objects[data.id].direction.z * 2;
			
			// auto explode bullet after ms
			
			if( Date.now() - parseInt(data.id.replace(/^bullet/, '') ) >= 3000){
				//console.log('boom');
				clearInterval(interval);
				delete objects[data.id];
				//console.log(objects);
				
				io.emit('deleteObject', data.id);
			}
			
		}, 20);
		
	});
	
	
	// game update interval
	
	var intervalGameUpdate = setInterval(function(){
		
		socket.emit('game_update', objects);
		
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









