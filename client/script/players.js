var playerSelf; // defined in socket.js on return connection.
var players = [];



function Player(player,isPlayerSelf) {

    var _self = this;
    
    var _isPlayerSelf = isPlayerSelf;

    var _id = player.id;
    var _isInPlayground = player.isInPlayground;
    var _position;
    var _team;
    
    var _animationCXElement;
    
    if (player.position) {
        _position = player.position;
    }

    var _element;
    
    if (_isPlayerSelf) {
        _element = player_selfElement;
    } else {
        _element = document.createElementNS(svgns,'circle');
        _element.classList.add('player');
            _element.setAttributeNS(null,'r','4.2');
        playersElement.insertBefore(_element,playersElement.firstChild);
    }
    
    
    
    /* Functions */

    function deletePlayer() {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id === _id) {
                break
            }
        }
        players.splice(i,1);
        _element.style.opacity = 0;
        setTimeout(function(){
            _element.remove()
        }, 500);
        if (playerSelf === _self) {
            error_kicked = true;
        }
        console.warn('Player deleted: '+_id);
    }
    
    function updatePosition() {
        if (_position) {
            if (_isPlayerSelf && _isInPlayground === false) {
                error_gps_wrong_position = true;
            } else if (_isPlayerSelf) {
                error_gps_wrong_position = false;
            }
            _element.setAttributeNS(null,'cx',getPxX(_position.x));
            _element.setAttributeNS(null,'cy',getPxY(_position.y));
            if (isPlayerSelf) {
                player_self_outer_circleElement.setAttributeNS(null,'cx',getPxX(_position.x));
                player_self_outer_circleElement.setAttributeNS(null,'cy',getPxY(_position.y));
            }
/*     	    console.log('Position updated'); */
        }
    }
    
    function updateTeam() {
        _element.classList.add('team'+_team);
        if (isPlayerSelf) {
            player_self_outer_circleElement.classList.add('team'+_team);
        }
    }
    

    
    /* Init */

    players.push(_self);
    
    
    
    /* Properties */

    Object.defineProperty(this, 'deletePlayer', {
    	get: function() { 
    	    deletePlayer();
        }
    });
    
    Object.defineProperty(this, 'position', {
    	set: function(position) {
    	    _position = position;
    	    updatePosition();
    	}
    });
    
    Object.defineProperty(this, 'isInPlayground', {
        get: function () { return _isInPlayground; },
    	set: function(isInPlayground) {
    	    _isInPlayground = isInPlayground;
    	}
    });
    
    Object.defineProperty(this, 'team', {
    	get: function() { return _team },
    	set: function(team) {
    	    if (_team !== team) {
        	    _team = team;
        	    updateTeam();
    	    }
    	}
    });
    
    Object.defineProperty(this, 'id', {
    	get: function() { return _id }
    });
    


} // end of Player()




function updatePlayers(_players) {
    
    /* update players */
    // _players = players from server (array with Objects)
    //players = players on device (array with instances of Player)
    
    for (var i = 0; i < _players.length; i++) {
        var _player = _players[i];
        var isPlayerInLocalArray = false;
        for (var j = 0; j < players.length; j++) {
            var player = players[j]
            if (_player.id === player.id) {
                isPlayerInLocalArray = true;
                if (_player.position) {
                    player.position = _player.position;
                }
                if (_player.team) {
                    player.team = _player.team;
                }
                if (_player.isInPlayground !== undefined) {
                    player.isInPlayground = _player.isInPlayground;
                }
            }
        }
        if (!isPlayerInLocalArray) { // create Player if it is not in local array
            if (_player.position) {
                new Player(_player);
            }
        }
    }
    
    /* remove players if they are not in _players */
    
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var isPlayerInServerArray = false;
        for (var j = 0; j < _players.length; j++) {
            _player = _players[j];
            if (player.id === _player.id) {
                isPlayerInServerArray = true;
            }
        }
        if (!isPlayerInServerArray) {
            player.deletePlayer;
        }
    }
   
} // end of updatePlayers()


