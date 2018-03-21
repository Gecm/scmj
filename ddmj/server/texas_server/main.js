var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var roommgr = require("./roommgr");

app.listen(8081);

function handler(req,res){
	console.log("hahaha");
}

var chathistory = [];

var playeridbase = 10000;
var playermap = {};
var playernamemap = {};

io.sockets.on('connection',function(socket){
	var player = {
		guid:playeridbase++,
		name:"",
		money:100000,
		lv:1,
		roomId:-1,
		seatIndex:-1,
		socket:socket
	};

	playermap[player.guid] = player;
	socket.player = player;
	socket.guid = player.guid;

	socket.emit("say","Welcome to here!");
	socket.on('create_role',function(data){
		if(socket.player == null){
			return;
		}
		if(playernamemap[data]){
			socket.emit('create_role_result',1);
			return;
		}
		playernamemap[data] = true;
		socket.player.name = data;
		socket.emit('create_role_result',0);

	});

	socket.on('get_user_info',function(data){
		var data = {
			guid:player.guid,
			name:player.name,
			money:player.money,
			lv:player.lv
		};
		socket.emit('get_user_info_result',data);
	});
	
	socket.on('chat',function(data){
		console.log(data);
		socket.broadcast.emit("say",socket.username + " say:  " + data);
		socket.emit("say","You say:  " + data);
		
		chathistory.push({name:socket.username,text:data});
		if(chathistory.length > 15)
		{
			chathistory.shift();
		}
	});

	socket.on('disconnect',function(data){
		delete playermap[socket.player.guid];
		delete playernamemap[socket.player.name];
		roommgr.exitRoom(socket.player);
		console.log("disconncet");
		socket.player = null;
	});

	socket.on('quick_start',function(data){
		console.log("quick_start");
		socket.emit('push_need_create_role',null);
	});

	socket.on('quick_play',function (data) {
		var roomId = roommgr.selectRoom(socket.player);
		socket.emit('quick_play_result',roomId);
	});

	socket.on('enter_room',function (data) {
		var roomId = data;
		var ret = roommgr.enterRoom(roomId,socket.player);
		socket.emit('enter_room_result',ret);
		if(ret == 0){
			var room = roommgr.getRoom(roomId);
			roommgr.pushRoomInfo(room,socket.player);
		}
	});

	socket.on('sit_down',function(data){
		if(socket.player.seatIndex >= 0){
			return;
		}
		var seatIndex = data;
		seatIndex = roommgr.takeASeat(socket.player,seatIndex);
		socket.emit('sit_down_result',seatIndex);
		if(seatIndex >= 0){
			var room = roommgr.getRoom(socket.player.roomId);
			var data = roommgr.getSeatData(room,seatIndex);
			roommgr.broadcastInRoom(socket.player.roomId,'push_player_sited',data);
		}
	});

	socket.on('stand_up',function (data) {

	});

	socket.on('buy_in',function(data){

	});

	socket.on('check',function(data){
		console.log('check');
		roommgr.onCheck(socket.player);
	});

	socket.on('fold',function(data){
		console.log('fold');
		roommgr.onFold(socket.player);
	});

	socket.on('call',function (data){
		console.log('call');
		roommgr.onCall(socket.player);
	});

	socket.on('raise',function(data){
		console.log('raise');
		roommgr.onRaise(socket.player,data);
	});

	socket.on('allin',function(data){
		console.log('allin');
		roommgr.onAllin(socket.player);
	});
});

setInterval(function(){
	roommgr.update();
},333);