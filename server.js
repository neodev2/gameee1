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


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var users = {};

io.on('connection', function(socket){
	
	// on connect
	
	users['_'+socket.id] = {
		w: 25,
		h: 25,
		d: 25,
		x: getRandomInt(0, 1100),
		y: getRandomInt(0, 700),
		z: getRandomInt(0, 700)
	};
	
	console.log(users);
	
	
	// on disconnect
	
	socket.on('disconnect', function(){
		
		delete users['_'+socket.id];
		
		io.emit('disconnect', '_'+socket.id);
		
		console.log(users);
		
	});
	
	
	// on action
	
	socket.on('x-', function(){
		
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
		
	});
		
	
	// game update interval
	
	var intervalGameUpdate = setInterval(function(){
		socket.emit('game_update', users);
	}, 50);
	
});


function blabla(id, type){
	
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
	
}









