/* var socket = io.connect('http://localhost:63439/'); */
var socket = io.connect('http://tobiasfw.centaurus.uberspace.de:63439');
/* var socket = io.connect('http://whoem.bootes.uberspace.de:64253'); */


socket.on('error', function (reason){
    error_socket_connection = true;
    console.error('Unable to connect Socket.IO', reason);
});
socket.on('connect', function (){
    console.info('successfully established a working connection');
});



/* RECIVE */

socket.on('returnConnection',function(player,polygons,scoreSet){

    error_socket_connection = false;
    
    createPolygonElements(polygons);
    playerSelf = new Player(player,true); // playerSelf defined in players.js

    updateScoreSet(scoreSet);
    
    console.log('return connection');
    
});


socket.on('gameInterval',function(players,newPolygons,scoreSet,winningTeam){

    if (newPolygons) {
        updatePolygons(newPolygons);
/*         console.log('update polygons'); */
    }
    if (scoreSet) {
        updateScoreSet(scoreSet);
    }
    if (winningTeam === 1 || winningTeam === 2) {
        showCanvasWin(winningTeam);
    } else {
        updatePlayers(players);
    }
    
/*     console.log('game interval'); */

});






/* SENT */

function updatePosition(position) {
/*     console.log('updatePosition'); */
    socket.emit('updatePosition',position);
}
