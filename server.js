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
				w: 50,
				h: 50,
				d: 50,
				x: 200,
				y: 200,
				z: 200
			}
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

const
    express     = require('express'),
	app         = express(),
	server      = require('http').Server(app),
    io          = require('socket.io')(server);

server.listen(process.env.PORT || 8000);

app.use('/resources', express.static(__dirname+'/public/resources'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
});

/*io.on('connection', function(socket){
	rooms[0].users.push({
        name: socket.id,
        w: 100,
        h: 100,
        d: 100,
        x: 0,
        y: 0,
        z: 0
    });
	socket.join(rooms[0].name);
	socket.emit('welcome', 'welcome');
    
    console.log(rooms);
});*/
















