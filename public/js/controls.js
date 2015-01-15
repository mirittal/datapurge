
  var socket = io();

  var rand = Math.floor(Math.random() *1000);

  var isAdmin = false;
  
  
  socket.on("my-turn", function(t) {
      	$("#message").html("MOVEMENT IS SUBJECT TO LIVESTREAM DELAY");
      	$("#controller").attr("src", dest + "0");	
		$(".controls, #stop_control").show();
		$(".timer").TimeCircles({
			"circle_bg_color": "#0e1216",
			"fg_width": 0.07,
			"time": {
		        "Days": {	          
		            "show": false
		        },
		        "Hours": {
		            "show": false
		        },
		        "Minutes": {
		            "show": false
		        },
		        "Seconds": {
		            "text": "",
		            "color": "#1ea806",
		            "show": true
		        }
		    }
		}); 

		//$(".user_controls").hide();
		//window.setTimeout(function() {  turnAllOff();}, 130000)
  });

  socket.on("lose-turn", function(t) {
  	  $(".timer").TimeCircles().destroy(); 
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

   socket.on("status", function(msg) {
   		$("#message").html(msg)
   })

   socket.on("message-from-doc", function(msg) {
   		$("#message").html(msg);
   });

$(function(){


	
	if( $("#admin").length > 0 )
		isAdmin = true;

	$(".controls").on("click" , function(){
		var butt = $(this);
		var c = butt.attr("data-motor-on");

		if(!butt.hasClass('active')){	
			var m = butt.attr("data-camera");
			if (typeof c != "undefined") {
				$("#controller").attr("src", dest + c);	
				butt.addClass("active").text("OOOH");
			} else if (typeof m != "undefined") {
				$("#controller").attr("src", cam + m);
				if (!isAdmin && butt.attr("id").indexOf("zoom") == -1) {
					butt.addClass("active");
					window.setTimeout(function(){ butt.removeClass("active") }, 20000)
				}
			}		
			
		} else {
			if (typeof c != "undefined") {
				turnMotorOff($(this));
			}
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
	
	$("#admin-control-status").on("click", function(){
		socket.emit('get-status');
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