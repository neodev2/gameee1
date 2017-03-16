$(window).load(function(){
    
    var socket = io();
    
    socket.on('welcome', function(data) {
        console.log(data);
    });
    
    //socket.emit('XXX', {XXX: 'XXX'});
    
});
