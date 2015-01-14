
  var socket = io();

  var rand = Math.floor(Math.random() *1000);

  
  
  socket.on("my-turn", function(t) {
      	$("#message").html("MOVEMENT IS SUBJECT TO LIVESTREAM DELAY");
      	$("#controller").attr("src", dest + "0");	
		$(".controls, #stop_control").show();

		//$(".user_controls").hide();
		//window.setTimeout(function() {  turnAllOff();}, 130000)
  });

  socket.on("lose-turn", function(t) {
      $("#message").html("CONTROL OVER");
      turnAllOff();
  });

   socket.on("turn-ack", function(msg) {
      $("#message").html(msg);
  });

   socket.on("reset", function(msg) {
   		$("#message").html(msg);
   		$(".controls").hide(); 
		$(".user_controls").show();
   });

   socket.on("message-from-doc", function(msg) {
   		$("#message").html(msg);
   });

$(function(){

	$(".controls").on("click" , function(){
		if(!$(this).hasClass('active')){

			var c = $(this).attr("data-motor-on");
			var m = $(this).attr("data-camera");
			if (typeof c != "undefined") {
				$("#controller").attr("src", dest + c);	
				$(this).addClass("active").text("OOOH");
			} else if (typeof m != "undefined") {
				$("#controller").attr("src", cam + m);
			}		
			
		} else {
			turnMotorOff($(this));
			
		}
	})

	$(".user_controls").on("click", function(){
		socket.emit('join', {email: "user1@" + rand});
		$(this).hide();
		
	})

	$("#admin-control").on("click", function(){
		var obj = $(this);
		if (obj.data("state") == "0") {
			socket.emit('take-control', 'admin');
			obj.text("release control");
			obj.data("state", "1")
		} else {
			socket.emit('release-control', 'admin');
			obj.text("block users control");
			obj.data("state", "0");
		}
	})

	 $("#stop_control").on("click", function(){
	 	turnAllOff();
	 	$(this).hide();
	 })

	$("#admin-message").on("click", function(){
		socket.emit('admin-message', $("#m").val());
	})	

	$("#admin-reset-message").on("click", function(){
		socket.emit('reset-all', $("#rm").val());
	})
	
});


function turnMotorOff(obj) {
	if(obj.hasClass('active')){
		var c = obj.attr("data-motor-off");
		obj.removeClass("active").text("PUSH");
		if (typeof c != "undefined") {
			$("#controller").attr("src", dest + c);	
		}
	}
}

function turnAllOff() {
	$(".controls").hide(); 
	$(".user_controls").show();
	$("#controller").attr("src", dest + "9");	
	$(".butt").each(function() {
		turnMotorOff($(this)) 
	})
}

var dest = "http://gibney280.no-ip.org:8282/?"
var cam = "http://gibney280.no-ip.org:8080/axis-cgi/com/ptz.cgi?"