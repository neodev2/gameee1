$(window).load(function(){
    
    var socket = io();
    
    socket.on('intervalGameUpdate', function(data) {
        console.log(data);
        $('body').html(data);
    });
    
    socket.on('disconnect', function(data) {
        console.log(data);
    });
    
    //socket.emit('XXX', {XXX: 'XXX'});
    
});
