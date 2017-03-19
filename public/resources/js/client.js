function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shadeColor(color, percent) {
	color = color.substr(1);
	var num = parseInt(color, 16),
	amt = Math.round(2.55 * percent),
	R = (num >> 16) + amt,
	G = (num >> 8 & 0x00FF) + amt,
	B = (num & 0x0000FF) + amt;
	return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function drawCube(x, y, wx, wy, h, color) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x - wx, y - wx * 0.5);
	ctx.lineTo(x - wx, y - h - wx * 0.5);
	ctx.lineTo(x, y - h * 1);
	ctx.closePath();
	ctx.fillStyle = shadeColor(color, -10);
	ctx.strokeStyle = color;
	ctx.stroke();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + wy, y - wy * 0.5);
	ctx.lineTo(x + wy, y - h - wy * 0.5);
	ctx.lineTo(x, y - h * 1);
	ctx.closePath();
	ctx.fillStyle = shadeColor(color, 10);
	ctx.strokeStyle = shadeColor(color, 50);
	ctx.stroke();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(x, y - h);
	ctx.lineTo(x - wx, y - h - wx * 0.5);
	ctx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
	ctx.lineTo(x + wy, y - h - wy * 0.5);
	ctx.closePath();
	ctx.fillStyle = shadeColor(color, 20);
	ctx.strokeStyle = shadeColor(color, 60);
	ctx.stroke();
	ctx.fill();
}

function update(data){
	
	for(let id in data){
	    
	    //if( document.querySelector('#'+id) ){
		if(shapes[id]){
		    
		    //$('#'+id).css({
		    //	left: data[id].x,
		    //	top: data[id].y,
		    //	background: data[id].collision == true ? 'red' : 'black'
	    	//});
	    	
	    	/*ctx.clearRect(shapes[id].x, shapes[id].y, shapes[id].w, shapes[id].h);
		    
	        shapes[id].x = data[id].x;
	        shapes[id].y = data[id].y;
	        
	        ctx.fillRect(shapes[id].x, shapes[id].y, shapes[id].w, shapes[id].h);
	        
	        ctx.fillStyle = data[id].collision == true ? 'red' : 'black';*/
	        
	        ctx.clearRect(shapes[id].x, shapes[id].y, shapes[id].w, shapes[id].h/*, shapes[id].d*/);
	        
	        shapes[id].x = data[id].x;
	        shapes[id].y = data[id].y;
	        //shapes[id].w = data[id].w;
	        //shapes[id].h = data[id].h;
	        //shapes[id].d = data[id].d;
	        
	        drawCube(shapes[id].x, shapes[id].y, shapes[id].w, shapes[id].h, shapes[id].d, '#ff8d4b');
	        
	    }else{
		    //$('body').append('<div id="'+id+'"></div>');
		    //$('#'+id).css({width: data[id].w, height: data[id].h});
		    
			shapes[id] = {
				x: getRandomInt(0, canvas.width),
				y: getRandomInt(0, canvas.height),
				w: data[id].w,
				h: data[id].h,
				d: data[id].d
			};
		    
	    }
	    
    }
    
}


var socket = io();


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var shapes = {};


var intervalXM, intervalXP, intervalYM, intervalYP;
var isLeftDown = false;
var isRightDown = false;
var isUpDown = false;
var isDownDown = false;
var btnSpeed = 10;

document.onkeydown = function(e){
	e.preventDefault();
	
	if(e.keyCode == 37){
		if(isLeftDown) return;
		isLeftDown = true;
		intervalXM = setInterval(function(){
			socket.emit('x-', 1);
		}, btnSpeed);
	}
	else if(e.keyCode == 39){
		if(isRightDown) return;
		isRightDown = true;
		intervalXP = setInterval(function(){
			socket.emit('x+', 1);
		}, btnSpeed);
	}
	else if(e.keyCode == 38){
		if(isUpDown) return;
		isUpDown = true;
		intervalYM = setInterval(function(){
			socket.emit('y-', 1);
		}, btnSpeed);
	}
	else if(e.keyCode == 40){
		if(isDownDown) return;
		isDownDown = true;
		intervalYP = setInterval(function(){
			socket.emit('y+', 1);
		}, btnSpeed);
	}
	
}

document.onkeyup = function(e){
	e.preventDefault();
	
	if(e.keyCode == 37){
		isLeftDown = false;
		clearInterval(intervalXM);
	}
	else if(e.keyCode == 39){
		isRightDown = false;
		clearInterval(intervalXP);
	}
	else if(e.keyCode == 38){
		isUpDown = false;
		clearInterval(intervalYM);
	}
	else if(e.keyCode == 40){
		isDownDown = false;
		clearInterval(intervalYP);
	}
	
}











socket.on('disconnect', function(id){
	console.log(id+' disconnected');
	//$('#'+id).remove();
	
	//ctx.clearRect(shapes[id].x, shapes[id].y, shapes[id].w, shapes[id].h);
	//delete shapes[id];
});


socket.on('game_update', function(data){
    //console.log(data);
    
    update(data);
    
});










