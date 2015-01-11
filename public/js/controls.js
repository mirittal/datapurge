
  var socket = io();

  var rand = Math.floor(Math.random() *1000);

  
  
  socket.on("my-turn", function(t) {
      	$("#st").html("THE CONTROL IS YOURS");
      	$("#controller").attr("src", dest + "0");	
		$(".controls, #stop_control").show();
		$(".user_controls").hide();
		window.setTimeout(function() {  turnAllOff();}, 130000)
  });

  socket.on("lose-turn", function(t) {
      $("#st").html("CONTROL OVER");
      turnAllOff();
  });

   socket.on("turn-ack", function(time) {
      $("#st").html("waiting...." + time);
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

	$(".user_controls").click(function(){
		socket.emit('join', {email: "user1@" + rand});
		
	})

	 $("#stop_control").click(function(){
	 	turnAllOff();
	 	$(this).hide();
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

var dest = "http://31downdatapurge.ddns.net:8282/?"
var cam = "http://31downdatapurge.ddns.net:8080/axis-cgi/com/ptz.cgi?"