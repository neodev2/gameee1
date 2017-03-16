var rooms = [
	{
		name: 'room0',
		users: [
			{
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
				w: 100,
				h: 100,
				d: 100,
				x: 0,
				y: 0,
				z: 0
			},
		],
		objects: [
			{
				name: 'cube5rf4yt',
				w: 100,
				h: 100,
				d: 100,
				x: 0,
				y: 0,
				z: 0
			},
			{
				name: 'cubeE8hh4k',
				w: 50,
				h: 50,
				d: 50,
				x: 10,
				y: 10,
				z: 10
			}
		]
	},
	{
		name: 'room1',
		users: [],
		objects: []
	}
];



var intervalGameUpdate = setInterval(function(){
	
	// display online users
	var onlineUsers = 0;
	for(var i in rooms){
		onlineUsers += rooms[i].users.length;
	}
	console.log(onlineUsers);
	
	
	
	// stream coordinates to players
	
	
}, 50);

/*this.on.connection = function(){
	var idTok = '_'+Date.now();
	users.push(idTok);
	rooms.push(idTok);
	idTok.emit('welcome');
}*/
