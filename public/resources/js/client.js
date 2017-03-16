$(window).load(function(){
    
    var socket = io();
    
    socket.on('intervalGameUpdate', function(data) {
        console.log(data);
        $('#div1').html( JSON.stringify(data, null, 2) );
    });
    
    socket.on('disconnect', function(data) {
        console.log(data);
    });
    
    //socket.emit('XXX', {XXX: 'XXX'});
    
    
    $('#input1, #input2, #input3').on('input', function(){
        socket.emit('move', {
            x: $('#input1').val(),
            y: $('#input2').val(),
            z: $('#input3').val()
        });
    });
    
});
