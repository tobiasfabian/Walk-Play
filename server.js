var helper = require('./helper');
var player = require('./player');
var fs = require('fs');
var playground = require('./playground');
var express = require('express');
var app = express();
console.log(__dirname);
app.use(express.static(__dirname + '/client'));


/* HELPER FUNCTIONS */

var isPointInPoly = helper.isPointInPoly;
var guid = helper.guid;



/* !init */

// var port = 64253; // Websockets Port Phil
var port = 63439; // Websockets Port Tobi
var io = require('socket.io').listen( app.listen(port), {log: false});
console.info('Created server at port: '+port);



/* GLOBALS */

var polygons = playground.polygons;
var playgroundPolygon = playground.playgroundPolygon;
var players = player.players;
var demandingPolygonID;
var checkWin = false;

setDemandingPolygon();

var scoreGame = {
    1: 0,
    2: 0
}; // kleiner Spielstand
var scoreSet = {
    1: 0,
    2: 0
}; // großer Spielstand


/* !sockets */

io.sockets.on('connection', function(client){

    var id = guid();

    var player = {
        id: id,
        oldTimestamp: false,
        team: getTeam()
    }
    
    players.push(player);
    
    console.log('New player:');
    console.log(player);

    client.emit('returnConnection',player,polygons,scoreSet);
    
    client.on('updatePosition',function(newPosition) {
        player.position = {};
        player.position.x = newPosition.x;
        player.position.y = newPosition.y;
        player.position.timestamp = new Date().getTime();

/*         console.log('Update Player: '+player.id); */
/*         console.log(player); */

    });
    

    
    var pointsArray = [];
    
/*     pointCoords */
    client.on('pointCoords',function(pointCoords) {
        pointsArray.push(pointCoords)
        var data = JSON.stringify(pointsArray);
        console.log(data);
        fs.writeFile('pointCoords.js', data, function(err){
            if (err) throw err;
            console.log('It\'s saved!');
        });
    });



/*     end of pointCoords */
    
    

});




/* !game interval */

setInterval(function() {
    if (players.length > 0) {
        if (checkWin === false) {
            checkWhichPlayersAreInDemandingPolygon();
            var winningTeam = checkIfAllPlayersOfTeamAreInDemandingPolygon(); // check who wins
            /* !if team wins game */
            if (winningTeam) {
                polygons[demandingPolygonID].team = winningTeam;
                updateScoreGame();
                /* !if team wins set */
                if (scoreGame[1] >= 13 || scoreGame[2] >= 13) { // new set if one team conquered major polygons (13)
                    updateScoreSet();
                    resetPolygons();
                    io.sockets.emit('gameInterval',players,polygons,scoreSet,winningTeam);
                    checkWin = true; // !set gamePause to false
                    winPause();
                } else { // new game
                    setDemandingPolygon();
                    io.sockets.emit('gameInterval',players,polygons,scoreSet);
                }
            } else { // playing
                io.sockets.emit('gameInterval',players,polygons);
            }
        } else {
            io.sockets.emit('gameInterval',players);
        }
    }
}, 500);



/* !functions */
/* !setDemandingPolygon() */

function setDemandingPolygon() {

    var potentialNewDemandingPolygons = [];
    for (var i = 0; i < polygons.length; i++) {
        var polygon = polygons[i];
        if (polygon.team === undefined) {
            potentialNewDemandingPolygons.push(polygon);
        }
    }
    
    demandingPolygonID = potentialNewDemandingPolygons[Math.round(Math.random()*(potentialNewDemandingPolygons.length-1))].id;
    polygons[demandingPolygonID].onDemand = true;
    
    console.log('New demanding polygon: '+demandingPolygonID);

}



/* !checkWhichPlayersAreInDemandingPolygon() */

function checkWhichPlayersAreInDemandingPolygon() {

    if (demandingPolygonID !== undefined) {
        
        var polygon = polygons[demandingPolygonID];
        
        var timestamp = new Date().getTime();
        var kickRate = 5000; // kick rate 5000ms = 5s
            
        for (var i = 0; i < players.length; i++) {
        
            var player = players[i];
            if (player.position) {
                if (player.position && player.position.timestamp < (timestamp-kickRate)) { // old timestamp
                    console.log('Player deleted (old timestamp): '+player.id);
    /*                 console.log(player); */
                    delete players.splice(i,1);
                } else {
                    if (!isPointInPoly(playgroundPolygon.points,player.position)) {
                        player.isInPlayground = false;
                        console.log('Player is outside of playground: '+player.id);
/*                         console.log(player); */
                    } else {
                        player.isInPlayground = true;
                    }
                    if (isPointInPoly(polygon.points,player.position)) {
                        player.isInDemandingPolygon = true;
                        console.log('Player is in polygon: '+player.id);
                        /* console.log(player); */
                    } else {
                        player.isInDemandingPolygon = false;
                    }
                }
            } // end if (player.position)
            
        } // end for

    } // end if (demandingPolygonID)
    
}



/* !checkIfAllPlayersOfTeamAreInDemandingPolygon */

function checkIfAllPlayersOfTeamAreInDemandingPolygon() {
    
    var activePlayersOfTeam1 = 0;
    var activePlayersOfTeam2 = 0;
    
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.isInPlayground && player.team === 1) {
            activePlayersOfTeam1++;
        } else if (player.isInPlayground && player.team === 2) {
            activePlayersOfTeam2++;
        }
    }
    
    var playersOfTeam1InDemandingPolygon = 0;
    var playersOfTeam2InDemandingPolygon = 0;

    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.team === 1 && player.isInDemandingPolygon) {
            playersOfTeam1InDemandingPolygon++;
        } else if (player.team === 2 && player.isInDemandingPolygon) {
            playersOfTeam2InDemandingPolygon++;
        }
    }
    
    if (demandingPolygonID !== undefined && activePlayersOfTeam1 !== 0 && activePlayersOfTeam1 === playersOfTeam1InDemandingPolygon) {
        console.log('Team 1 wins');
        polygons[demandingPolygonID].onDemand = false;
        return 1;
    } else if (demandingPolygonID !== undefined && activePlayersOfTeam2 !== 0 && activePlayersOfTeam2 === playersOfTeam2InDemandingPolygon) {
        console.log('Team 2 wins');
        polygons[demandingPolygonID].onDemand = false;
        return 2;
    } else {
/*
        console.log('Players of team 1 in demanding polygon: '+activePlayersOfTeam1InDemandingPolygon+'('+activePlayersOfTeam1+')');
        console.log('Players of team 2 in demanding polygon: '+activePlayersOfTeam2InDemandingPolygon+'('+activePlayersOfTeam2+')');
*/
        return false;
    }
    
}



function updateScoreGame() {
    var scoreGameTeam1 = 0;
    var scoreGameTeam2 = 0;
    for (var i = 0; i < polygons.length; i++) {
        var polygon = polygons[i];
        if (polygon.team === 1) {
            scoreGameTeam1++;
        } else if (polygon.team === 2) {
            scoreGameTeam2++;
        }
    }
    scoreGame[1] = scoreGameTeam1;
    scoreGame[2] = scoreGameTeam2;
    console.log('New game score: '+scoreGame[1]+':'+scoreGame[2]);
}



function updateScoreSet() {
    if (scoreGame[1] > scoreGame[2]) {
        scoreSet[1]++;
    } else {
        scoreSet[2]++;
    }
    console.log('New set score: '+scoreSet[1]+':'+scoreSet[2]);
}


function resetPolygons() {
    for (var i = 0; i < polygons.length; i++) {
        var polygon = polygons[i];
        polygon.onDemand = false;
        delete polygon.team;
    }
    demandingPolygonID = null;
}



function getTeam() {
    var playersInTeam1 = 0;
    var playersInTeam2 = 0;
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.isInPlayground && player.team === 1) {
            playersInTeam1++;
        } else if (player.isInPlayground && player.team === 2) {
            playersInTeam2++;
        }
    }
    if (playersInTeam1 > playersInTeam2) {
        return 2;
    } else {
        return 1;
    }
}

function winPause() {
    // set checkWin to false after 30 seconds
    setTimeout(function(){
        checkWin = false;
        setDemandingPolygon();
    }, 30000);
}



