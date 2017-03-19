var rooms = [
	{
		name: 'room0',
		users: [
			/*{
				name: 'admin',
				w: 100,
				h: 100,
				d: 100,
				x: 0,
				y: 0,
				z: 0
			},
			{
				name: 'gigi',
				w: 50,
				h: 50,
				d: 50,
				x: 200,
				y: 200,
				z: 200
			}*/
		],
		objects: [
			{
				name: 'cube5rf4yt',
				w: 20,
				h: 20,
				d: 20,
				x: 300,
				y: 10,
				z: -150,
				c: 'blue'
			},
			{
				name: 'cubeE8hh4k',
				w: 20,
				h: 20,
				d: 20,
				x: 400,
				y: 10,
				z: 200,
				c: 'blue'
			}
		]
	},
	{
		name: 'room1',
		users: [],
		objects: []
	}
];

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




io.on('connection', function(socket){
	
	// create user
	
	rooms[0].users.push({
		name: socket.id,
		w: 20,
		h: 20,
		d: 20,
		x: 0,
		y: 10,
		z: 0
	});
	/*socket.join(rooms[0].name);*/
	
	// delete user, emit
	
	socket.on('disconnect', function(){
		
		io.emit('disconnect', {
			id: socket.id,
			info: 'disconnected'
		});
		
		for(let i=0; i<rooms[0].users.length; i++){
			if(rooms[0].users[i].name == socket.id){
				
				rooms[0].users.splice(i, 1);
				
			}
		}
		
	});
	
	// update user x y z
	
	socket.on('move', function(data){
		
		for(let i=0; i<rooms[0].users.length; i++){
			if(rooms[0].users[i].name == socket.id){
				
				rooms[0].users[i].x = data.x;
				rooms[0].users[i].y = data.y;
				rooms[0].users[i].z = data.z;
				
			}
		}
		
	});
	
	
	socket.on('fire', function(data){
		fire(socket.id, data);
	});
	
	
	var intervalGameUpdate = setInterval(function(){
		socket.emit('intervalGameUpdate', rooms);
	}, 50);
	
});

function fire(socketId, data){
	//console.log(socketId);
	//console.log(data.pos);
	//console.log(data.dir);
	//console.log(data.weap);
	
	// create bullet, move interval
	
	var w, h, d;
	
	if(data.weap == 'machinegun'){
		w = 4;
		h = 4;
		d = 4;
	}
	
	var name = 'bullet'+Date.now();
	
	rooms[0].objects.push({
		name: name,
		w: w,
		h: h,
		d: d,
		x: data.pos.x,
		y: data.pos.y,
		z: data.pos.z,
		c: 'orange'
	});
	
	var intervalBlabla = setInterval(function(){
		
		for(var i=0; i<rooms[0].objects.length; i++){
			if(rooms[0].objects[i].name == name){
				
				rooms[0].objects[i].x += data.dir.x * 2;
				rooms[0].objects[i].y += data.dir.y * 2;
				rooms[0].objects[i].z += data.dir.z * 2;
				
			}
		}
		
	}, 50);
	
}














