var turnQueue = [];
var activeTurn = false;
//var redis = require('./redis');//.emu();

var TURN_TIME = 15000;
var io;

module.exports.push = function(sockid) {
  turnQueue.push(sockid);
  for (var i=0; i< turnQueue.length; i++) {
    console.log("TT" + turnQueue[i])
  }
  
}



module.exports.checkQueue = checkQueue;

function checkQueue(newReq, io) {
  //var io = require('socket.io-emitter')(redis, {key: 'xpemu'});

  if (!activeTurn && turnQueue.length >= 1) {
    activeTurn = true;
    var sockid = turnQueue.shift();
    console.log(sockid)
    for (var i=0; i< turnQueue.length; i++) {
      console.log("BB" + turnQueue[i])
    }
    io = io.in(sockid);
    io.emit('my-turn',TURN_TIME);

    setTimeout(function() {
      io.emit('lose-turn');
      activeTurn = false;
      checkQueue(false);
    }, TURN_TIME);

  } else if (newReq) {
    var time = turnQueue.length * TURN_TIME;
    var sockid = turnQueue[turnQueue.length - 1];
    io = io.in(sockid);
    io.emit('turn-ack', time);
  }
}