var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var turn = require('./controllers/TurnControllers.js');

var port = (process.env.PORT || 3000);




/* ---- queue specific vars ----- */
var clients = [];
var turnQueue = [];
var activeTurn = false;
//var redis = require('redis').io();

var TURN_TIME = 25000;
/* ------ end  queue specific vars --------- */


app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render(__dirname + '/views/index', { admin: req.query.admin });
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket){
	//clients[socket.id] = socket;
	
 	  socket.on('admin-message', function(msg){
    	io.emit('message-from-doc', msg);
  	});

    socket.on('reset-all', function(msg){
      io.emit('reset', msg);
    });

  	socket.on('join', function (data) {
	    //socket.join(data.email); // We are using room of socket io
	    turnQueue.push(socket.id);
      console.log("join queue: " + JSON.stringify(turnQueue))
    	checkQueue(true);
	 });


    //admin control
    socket.on('take-control', function (data) {
      turnQueue.unshift(socket.id);
      checkQueue(true, true);
   });

    //admin release
    socket.on('release-control', function (data) {
      ADMIN_MODE = false;
      activeTurn = false;
      io.in(current_socket_id).emit('lose-turn');
      sendMessageToQueue();
      checkQueue(false); 

   });

  	 socket.on('disconnect', function () {
        console.log('DISCONNECTED!!! ' +socket.id);
        console.log("before disconnect: " + JSON.stringify(turnQueue))
        var index;
        for (var i=0; i<turnQueue.length; i++) {
        	console.log("t: " + turnQueue[i])
        	if(turnQueue[i] == socket.id) {
        		turnQueue.splice(i, 1);
            
        		index = i;
        		console.log(i)
        		break;
        	}
        }
        console.log("after disconnect: " + JSON.stringify(turnQueue))
        sendMessageToQueue();
        
        
    });

  	

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var ADMIN_MODE = false;
var current_socket_id = "";


function checkQueue(newReq, isAdmin) {
  //var io = require('socket.io-emitter')(redis, {key: 'xpemu'});
  console.log("queue: " + JSON.stringify(turnQueue))

  if (!activeTurn && isAdmin) 
    ADMIN_MODE = true;

  if (!activeTurn && turnQueue.length >= 1) {
    activeTurn = true;
    current_socket_id = turnQueue.shift();
    sendMessageToQueue();
    console.log("current_socket_id: " + current_socket_id + "-- queue length: " + turnQueue.length)
      
    io.in(current_socket_id).emit('my-turn',TURN_TIME);

    if(!ADMIN_MODE) {
        console.log("timeout for current sock " + current_socket_id)
        setTimeout(function() {
          io.in(current_socket_id).emit('lose-turn');
          activeTurn = false;
          checkQueue(false);    
  	   }, TURN_TIME);
    } else {
        sendMessageToQueue("please wait - doctor is in control");
    }

  } else if (newReq) {
      if(isAdmin) {
        ADMIN_MODE = true;
        var sockid = turnQueue[turnQueue.length - 1];
        io.in(sockid).emit('turn-ack', "control will be yours soon... ");
      } else {
      	var sockid = turnQueue[turnQueue.length - 1];
        console.log("new req queue: " + JSON.stringify(turnQueue))
        if (ADMIN_MODE)
          io.in(sockid).emit('turn-ack', "please wait - doctor is in control");
        else  
      	   io.in(sockid).emit('turn-ack', "Estimated wait time less than " + turnQueue.length + " minutes");
      }
  }
}


function sendMessageToQueue(msg) {
    for (var i = 0; i<turnQueue.length; i++) {
          var sockid = turnQueue[i];
          if(msg)
            io.in(sockid).emit('turn-ack', msg);
          else  
            io.in(sockid).emit('turn-ack', "Estimated wait time less than " + (i+1) + " minutes");
    }
}