//

var MAX_ROOM = 10;
var roomIdBase = 1;
var roomList = [];
var roomMap = {};

var ROOM_STATE_IDLE = "idle";
var ROOM_STATE_WAITING = "waiting";
var ROOM_STATE_DEALING = "dealing";
var ROOM_STATE_PREFLOP = "preflop";
var ROOM_STATE_FLOP = "flop";
var ROOM_STATE_TURN = "turn";
var ROOM_STATE_RIVER = "river";
var ROOM_STATE_COMPUTING = "computing";

var PLAYER_ACTION_NONE = "none";
var PLAYER_ACTION_READY = "ready";
var PLAYER_ACTION_FOLD = "fold";
var PLAYER_ACTION_CHECK = "check";
var PLAYER_ACTION_CALL = "call";
var PLAYER_ACTION_RAISE = "raise";
var PLAYER_ACTION_ALLIN = "allin";

var MAX_POKER_NUM = 52;
var PokerKind = [MAX_POKER_NUM];
for(var i = 0; i < MAX_POKER_NUM; ++i){
    if(i >= 0 && i <= 12){
        PokerKind[i] = 1;
    }
    if(i >= 13 && i <= 25){
        PokerKind[i] = 2;
    }
    if(i >= 26 && i <= 38){
        PokerKind[i] = 3;
    }
    if(i >= 39 && i <= 51){
        PokerKind[i] = 4;
    }
}

function createRoom(maxSeats){
    var room = {
        guid:roomIdBase++,
        thinkingTime:250,
        blinds:100,
        playerList:[],
        seats:new Array(maxSeats),
        numOfUsedSeats:0,
        cardPool:new Array(MAX_POKER_NUM),
        currentCardIndex:0,
        commonCards:[-1,-1,-1,-1,-1],
        button:-1,
        smallBlind:-1,
        bigBlind:-1,
        state:ROOM_STATE_IDLE,
        currentActionSeat:0,
        lastActionBeginTime:0,
        pot:0,
        beginActionSeat:-1,
        beginActionBet:0,
        bet:0
    };

    for(var i = 0; i < room.cardPool.length; ++i){
        room.cardPool[i] = i;
    }

    for(var i = 0; i < room.seats.length; ++i){
        room.seats[i] = {
            player:null,
            chips:2500,
            lastAction:PLAYER_ACTION_NONE,
            cards:[2],
            bet:0
        };
    }
    roomMap[room.guid] = room;
    roomList.push(room);
    return room;
}

function destroyRoom(roomId) {
    var room = roomMap[roomId];
    if(room == null){
        return;
    }

    delete roomMap[roomId];
    var index = roomList.indexOf(room);
    if(index >= 0){
        roomList.splice(index);
    }
}

function getSeatData(room,seatIndex){
    if(room == null){
        return null;
    }
    if(seatIndex == null || seatIndex < 0 || seatIndex >= room.seats.length){
        return null;
    }
    var seat = room.seats[seatIndex];
    if(seat.player){
        return {
            seatIndex:seatIndex,
            name:seat.player.name,
            chips:seat.chips,
            bet:seat.bet,
            lastAction:seat.lastAction,
            icon:""
        };
    }
    return null;
}

function getRoomData(room){
    if(room){
        var data = {
            button:room.button,
            smallblind:room.smallBlind,
            bigblind:room.bigBlind,
            blinds:room.blinds,
            seats:null,
            cards:room.commonCards
        };
        data.seats = [];
        for(var i = 0; i < room.seats.length; ++i){
            var seatdata = getSeatData(room,i);
            if(seatdata){
                data.seats.push(seatdata);
            }
        }
        return data;
    }
    return null;
}

function broadcastInRoom(room,message,data,sender){
    for(var i = 0; i < room.playerList.length; ++i){
        var player = room.playerList[i];
        if(player != sender){
            player.socket.emit(message,data);
        }
    }
}

function getNextPlayer(room,seatIndex) {
    var index = (seatIndex + 1)%room.seats.length;
    while(index != seatIndex){
        var seat = room.seats[index];
        if(seat.player != null && seat.player.lastAction != PLAYER_ACTION_FOLD && seat.player.lastAction != PLAYER_ACTION_NONE){
            return index;
        }
        index = (index + 1)%room.seats.length;
    }
    return index;
}

function markReadyPlayers(room) {
    for(var i = 0; i < room.seats.length; ++i){
        var seat = room.seats[i];
        seat.lastAction = PLAYER_ACTION_READY;
        seat.cards[0] = -1;
        seat.cards[1] = -1;
        seat.bet = 0;
        if(seat.chips < 2500){
            seat.chips = 2500;
        }
    }
    room.bet = 0;
    room.pot = room.blinds*1.5;
}

function shuffle(room) {
    room.currentCardIndex = 0;
    var pokers = room.cardPool;
    for(var i = 0; i < pokers.length; ++i){
        var lastIndex = pokers.length - 1 - i;
        var index = Math.floor(Math.random() * lastIndex);
        var t = pokers[index];
        pokers[index] = pokers[lastIndex];
        pokers[lastIndex] = t;
    }
    //console.log(pokers);
}

function chooseButton(room) {
    if(room.button < 0){
        room.button = Math.floor(Math.random() * (room.seats.length - 1));
    }
    room.button = getNextPlayer(room,room.button);
}

function betBlinds(room) {

    //reset total bet
    room.totalBetPool = 0;

    //set small blind.
    var smallBlindseatIndex = getNextPlayer(room,room.button);
    room.smallBlind = smallBlindseatIndex;
    var smallBlindSeat = room.seats[smallBlindseatIndex];

    var smallBlind = room.blinds/2;
    smallBlindSeat.chips -= smallBlind;
    smallBlindSeat.bet = smallBlind;

    //set big blind.
    var bigBlindseatIndex = getNextPlayer(room,smallBlindseatIndex);
    room.bigBlind = bigBlindseatIndex;
    var bigBlindSeat = room.seats[bigBlindseatIndex];
    var bigBlind = room.blinds;
    bigBlindSeat.chips -= bigBlind;
    bigBlindSeat.bet = bigBlind;
    room.bet = bigBlind;
}

function deal(room) {
    var seatIndex = room.button;
    var cardIndex = 0;
    while(true){
        seatIndex = getNextPlayer(room,seatIndex);
        var seat = room.seats[seatIndex];
        if(seat.cards[cardIndex] >= 0){
            cardIndex ++;
            if(cardIndex >= 2){
                return;
            }
        }

        seat.cards[cardIndex] = room.cardPool[room.currentCardIndex];
        room.currentCardIndex ++;
    }
}

function askPlayerToDoAction(room,seatIndex){
    var seatIndex = getNextPlayer(room,seatIndex);
    var old = seatIndex;
    while(true){
        //如果此座位为上一次加注的玩家。 表示已经在他加注后，走了一圈了。  这里，就算是玩家离开座位，也要按他的位置作为标准。
        //那么，我们结束这一阶段
        if(room.beginActionSeat == seatIndex && room.beginActionBet == room.bet){
            CurrentTurnOver(room);
            return;
        }
        var seat = room.seats[seatIndex];
        if(seat.player != null && seat.player.lastAction != PLAYER_ACTION_FOLD && seat.player.lastAction != PLAYER_ACTION_NONE && seat.player.lastAction != PLAYER_ACTION_ALLIN){
            broadcastInRoom(room,"turn_to_action",{seatIndex:seatIndex,time:room.thinkingTime,bet:room.bet});
            room.currentActionSeat = seatIndex;
            room.lastActionTime = Date.now();

            //如果是第一个玩家，则记录此时的座位和下注额
            if(room.beginActionSeat < 0) {
                room.beginActionSeat = seatIndex;
                room.beginActionBet = room.bet;
            }
            return;
        }
        seatIndex = getNextPlayer(room,seatIndex);
        if(seatIndex == old){
            return;
        }
    }
}

function pushRoomInfo(room,player){
    var data = getRoomData(room);
    if(data){
        if(player){
            player.socket.emit('push_room_info',data);
        }
        else{
            broadcastInRoom(room,"push_room_info",data);
        }
    }
}

function dealPokers(room) {
    markReadyPlayers(room);
    chooseButton(room);
    betBlinds(room);
    shuffle(room);
    deal(room);
    pushRoomInfo(room,null);

    broadcastInRoom(room,"deal_pokers");
    console.log(room.seats.length);
    for(var i = 0; i < room.seats.length; ++i){
        var seat = room.seats[i];
        if(seat.player && seat.lastAction == PLAYER_ACTION_READY){
            console.log("push_holecards");
            seat.player.socket.emit("push_holecards",seat.cards);
        }
    }
}

function CurrentTurnOver(room) {
    //如果是底牌圈，则翻开3张公共牌
    if(room.state == ROOM_STATE_PREFLOP){
        var cards = [0,0,0];
        for(var i = 0; i < 3; ++i){
            var cardid = room.cardPool[room.currentCardIndex];
            room.currentCardIndex++;
            cards[i] = cardid;
            room.commonCards[i] = cardid;
        }
        room.state = ROOM_STATE_FLOP;
        room.beginActionSeat = -1;
        broadcastInRoom(room,"push_flop",cards);
    }
    else if(room.state == ROOM_STATE_FLOP){
        //如果是翻牌圈，则转牌
        var cardid = room.cardPool[room.currentCardIndex];
        room.currentCardIndex++;
        room.commonCards[3] = cardid;
        room.state = ROOM_STATE_TURN;
        room.beginActionSeat = -1;
        broadcastInRoom(room,"push_turn",cardid);
    }
    else if(room.state == ROOM_STATE_TURN){
        //如果是转牌圈，则翻开河牌
        var cardid = room.cardPool[room.currentCardIndex];
        room.currentCardIndex++;
        room.commonCards[4] = cardid;
        room.state = ROOM_STATE_RIVER;
        room.beginActionSeat = -1;
        broadcastInRoom(room,"push_river",cardid);
    }
    else if(room.state == ROOM_STATE_RIVER){
        //如果是河牌圈，则游戏结束
        room.beginActionSeat = -1;
        GameplayOver(room);
        return;
    }

    for(var i = 0; i < room.seats.length; ++i){
        room.seats[i].bet = 0;
    }
    console.log("room.pot:" + room.pot);
    room.bet = 0;
    askPlayerToDoAction(room,room.button);
}

//如果只有一个人存活，或者全部ALLIN了。
function CheckGameOver(room) {
    var livecnt = 0;
    var total = 0;
    for(var i = 0; i < room.seats.length; ++i){
        if(room.seats[i].lastAction == PLAYER_ACTION_CHECK
            || room.seats[i].lastAction == PLAYER_ACTION_CALL
            || room.seats[i].lastAction == PLAYER_ACTION_RAISE
            || room.seats[i].lastAction == PLAYER_ACTION_ALLIN){
            livecnt ++;
        }
        if(room.seats[i].lastAction != PLAYER_ACTION_NONE){
            total++;
        }
    }
    if(livecnt <= total - 1){
        return true;
    }
    return false;
}

function GameplayOver(room) {
    console.log("game over.");
    console.log("room.pot:" + room.pot);
    for(var i = 0; i < room.seats.length; ++i){
        if(room.seats[i].lastAction != PLAYER_ACTION_NONE && room.seats[i].lastAction != PLAYER_ACTION_FOLD){
            room.seats[i].chips += room.pot;
            break;
        }
    }

    room.state = ROOM_STATE_WAITING;
}

exports.getRoom = function (roomId) {
  return roomMap[roomId];
};

exports.update = function(){
    for(var i = 0; i < roomList.length; ++i){
        var room = roomList[i];
        if(room.state == ROOM_STATE_IDLE){
            if(room.numOfUsedSeats >= 2){
                room.state = ROOM_STATE_WAITING;
                room.lastActionBeginTime = Date.now();
            }
            continue;
        }

        if(room.state == ROOM_STATE_WAITING && room.numOfUsedSeats < 2){
            room.state = ROOM_STATE_IDLE;
        }

        if(room.state == ROOM_STATE_WAITING && Date.now() > room.lastActionBeginTime + 3000){
            dealPokers(room);
            room.state = ROOM_STATE_DEALING;
            room.lastActionBeginTime = Date.now();
        }

        if(room.state == ROOM_STATE_DEALING && Date.now() > room.lastActionBeginTime + 5000){
            console.log("preflop action.");
            room.beginActionSeat = -1;
            askPlayerToDoAction(room,room.bigBlind);
            room.lastActionBeginTime = Date.now();
            room.state = ROOM_STATE_PREFLOP;
        }

        if(room.state == ROOM_STATE_PREFLOP || room.state == ROOM_STATE_TURN || room.state == ROOM_STATE_RIVER){
            if(room.currentActionSeat >= 0){
                if(room.lastActionTime + room.thinkingTime* 1000 < Date.now()){
                    var player = room.seats[room.currentActionSeat].player;
                    exports.onFold(player);
                }
            }
        }
    }
};

exports.selectRoom = function(player){
    for(var i = 0; i < roomList.length; ++i){
        var room = roomList[i];
        if(room.playerList.length < 20){
            return room.guid;
        }
    }
    var room = createRoom(5);
    return room.guid;
}

exports.enterRoom = function(roomId,player){

    // if the player already in the given room. ignore this request.
    if(player.roomId > 0){
        return -1;
    }
    //
    var room = roomMap[roomId];
    if(room == null){
        return -2;
    }

    //a room can only contains less than 20 players.
    if(room.playerList.length >= 20){
        return -3;
    }

    //add player to the room's player list.
    room.playerList.push(player);

    //record this roomId on player.
    player.roomId = roomId;

    return 0;
};

exports.takeASeat = function(player,seatIndex){
    if( player.roomId <= 0){
        return -1;
    }

    var room = roomMap[player.roomId];
    if(room == null){
        return -2;
    }
    if(seatIndex == null || seatIndex < 0){
        console.log(room.numOfUsedSeats);
        if(room.numOfUsedSeats < room.seats.length){
            for(var i = 0; i < room.seats.length; ++i){
                if(room.seats[i].player == null) {
                    seatIndex = i;
                    break;
                }
            }
        }
    }

    if( seatIndex == null || seatIndex < 0 ) {
        return -3;
    }

    room.seats[seatIndex].player = player;
    player.seatIndex = seatIndex;
    room.numOfUsedSeats++;
    return seatIndex;
};

exports.exitRoom = function (player) {
    var room = roomMap[player.roomId];
    if(room == null) {
        return false;
    }
    if(player.seatIndex >= 0){
        this.standUp(player);
    }
    var index = room.playerList.indexOf(player);
    if(index >= 0){
        room.playerList.splice(index);
    }
    player.roomId = -1;
};

exports.standUp = function(player){
    var room = roomMap[player.roomId];
    if(room == null){
        return false;
    }

    if(player.seatIndex >= 0 && player.seatIndex <= room.seats.length){
        var seat = room.seats[player.seatIndex];
        if(seat.player == player) {
            seat.player = null;
            room.numOfUsedSeats--;
            if (room.numOfUsedSeats == 0) {
                GameplayOver(room);
            }
            else {
                var seatIndex = room.currentActionSeat;
                if(player.seatIndex == seatIndex){
                    room.currentActionSeat = -1;
                    askPlayerToDoAction(room,seatIndex);
                }
                player.seatIndex = -1;
            }
            return true;
        }
    }
    return false;
};

exports.broadcastInRoom = function (roomId,message,data,sender){
    if(roomId <= 0){
        return -1;
    }
    var room = this.getRoom(roomId);
    if(room == null){
        return -2;
    }
    broadcastInRoom(room,message,data,sender);
    return 0;
};

exports.onFold = function(player) {
    if(!player){
        return;
    }
    if(player.roomId < 0){
        return;
    }

    var room = roomMap[player.roomId];
    if(!room){
        return;
    }

    if(player.seatIndex < 0){
        return;
    }
    var seat = room.seats[player.seatIndex];

    seat.lastAction = PLAYER_ACTION_FOLD;
    var data = {
        seatIndex:player.seatIndex,
        action:seat.lastAction
    };
    broadcastInRoom(room,"push_player_action",data);

    if(CheckGameOver(room)){
        GameplayOver(room);
    }
    else{
        askPlayerToDoAction(room,player.seatIndex);
    }
};

exports.onCheck = function(player){
    if(!player){
        return;
    }
    if(player.roomId < 0){
        return;
    }

    var room = roomMap[player.roomId];
    if(!room){
        return;
    }

    if(player.seatIndex < 0){
        return;
    }

    var seat = room.seats[player.seatIndex];
    if(room.bet != seat.bet){
        return;
    }

    seat.lastAction = PLAYER_ACTION_CHECK;
    var data = {
        seatIndex:player.seatIndex,
        action:seat.lastAction
    };
    broadcastInRoom(room,"push_player_action",data);
    askPlayerToDoAction(room,player.seatIndex);
};

exports.onCall = function(player) {
    if(!player){
        return;
    }
    if(player.roomId < 0){
        return;
    }

    var room = roomMap[player.roomId];
    if(!room){
        return;
    }
    if(room.bet == 0){
        return;
    }

    if(player.seatIndex < 0){
        return;
    }
    var seat = room.seats[player.seatIndex];
    var diff = room.bet - seat.bet;
    if(diff > seat.chips) {
        return;
    }

    seat.chips -= diff;
    seat.bet = room.bet;
    room.pot += diff;

    seat.lastAction = PLAYER_ACTION_CALL;
    var data = {
        seatIndex:player.seatIndex,
        action:seat.lastAction,
        chips:seat.chips,
        bet:seat.bet
    };
    broadcastInRoom(room,"push_player_action",data);
    askPlayerToDoAction(room,player.seatIndex);
};

exports.onRaise = function(player,data) {
    if(!player){
        return;
    }
    if(player.roomId < 0){
        return;
    }

    var room = roomMap[player.roomId];
    if(!room){
        return;
    }

    if(player.seatIndex < 0){
        return;
    }

    var targetBet = data;
    if(targetBet < room.bet * 2){
        return;
    }
    var seat = room.seats[player.seatIndex];
    var diff = targetBet - seat.bet;
    if(diff > seat.chips) {
        return;
    }

    seat.chips -= diff;
    seat.bet = targetBet;
    room.bet = targetBet;
    room.pot += diff;
    seat.lastAction = PLAYER_ACTION_RAISE;

    room.beginActionSeat = player.seatIndex;
    room.beginActionBet = room.bet;

    var data = {
        seatIndex:player.seatIndex,
        action:seat.lastAction,
        chips:seat.chips,
        bet:seat.bet
    };
    broadcastInRoom(room,"push_player_action",data);

    askPlayerToDoAction(room,player.seatIndex);
};

exports.onAllin = function(player) {
    if(!player){
        return;
    }
    if(player.roomId < 0){
        return;
    }

    var room = roomMap[player.roomId];
    if(!room){
        return;
    }

    if(player.seatIndex < 0){
        return;
    }

    var seat = room.seats[player.seatIndex];
    seat.bet += seat.chips;
    room.pot += seat.chips;
    seat.chips = 0;
    if(seat.bet > room.bet){
        room.bet = seat.bet;
        room.beginActionSeat = player.seatIndex;
        room.beginActionBet = room.bet;
    }

    seat.lastAction = PLAYER_ACTION_ALLIN;
    var data = {
        seatIndex:player.seatIndex,
        action:seat.lastAction,
        chips:seat.chips,
        bet:seat.bet
    };
    broadcastInRoom(room,"push_player_action",data);
    askPlayerToDoAction(room,player.seatIndex);
};

exports.getSeatData = getSeatData;
exports.getRoomData = getRoomData;
exports.pushRoomInfo = pushRoomInfo;