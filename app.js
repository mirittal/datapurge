var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var turn = require('./controllers/TurnControllers.js');

var clients = [];

var turnQueue = [];
var activeTurn = false;
//var redis = require('./redis');//.emu();

var TURN_TIME = 15000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

io.sockets.on('connection', function(socket){
	//clients[socket.id] = socket;
	
 	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});

  	socket.on('join', function (data) {
	    socket.join(data.email); // We are using room of socket io
	    turnQueue.push(socket.id);
    	checkQueue(true);
	 });

  	 socket.on('disconnect', function () {
        console.log('DISCONNECTED!!! ' +socket.id);
        var index;
        for (var i=0; i<=turnQueue.length; i++) {
        	console.log("t: " + turnQueue[i])
        	if(turnQueue[i] == socket.id) {
        		//turnQueue.splice(i, 1);
        		index = i;
        		console.log(i)
        		break;
        	}
        }
      /*  for (var i = index; i<turnQueue.length; i++) {
        	var time = turnQueue.length * TURN_TIME;
    		var sockid = turnQueue[i];
   			io.in(sockid).emit('turn-ack', "please wait " + time + " "  + i + " before");
        }*/
        
        
    });

  	

});

http.listen(3000, function(){
  console.log('listening on *:5000');
});


function checkQueue(newReq) {
  //var io = require('socket.io-emitter')(redis, {key: 'xpemu'});

  if (!activeTurn && turnQueue.length >= 1) {
    activeTurn = true;
    var sockid = turnQueue.shift();
    //var sockid = clients.shift();
    console.log("sid: " + sockid)
    
    console.log("BB " + turnQueue.length)
    
    io.in(sockid).emit('my-turn',TURN_TIME);

    setTimeout(function() {
      io.emit('lose-turn');
      activeTurn = false;
      checkQueue(false);    
	}, TURN_TIME);

  } else if (newReq) {
    	var time = turnQueue.length * TURN_TIME;
    	var sockid = turnQueue[turnQueue.length - 1];
    	io.in(sockid).emit('turn-ack', "please wait " + time + " "  + turnQueue.length + " before");
  }
}