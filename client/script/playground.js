/* center of playground */
var mercCenterOfPlayground = {
    x: 1261228,
    y: 6584424
}

/* scale playground */
var zoom = .45;

/* canvas dimensions */
var canvasWidth = svgElement.offsetWidth;
var canvasHeight = svgElement.offsetHeight;

var polygons = []; // will be filled on init of Polygon() instance



function Polygon(polygon) { // class

    var _polygon = polygon;

    var _onDemand = polygon.onDemand;
    var _team = polygon.team;
    var _element;
    var _points = [];
    
    
    
    /* functions */
    
    function updateDemand() {
        if (_onDemand) {
            _element.classList.add('demand');
        } else {
            _element.classList.remove('demand');
        }
    }
    function updateTeam() {
        if (_team) {
            _element.classList.add('team'+_team);
        } else {
            _element.classList.remove('team1');
            _element.classList.remove('team2');
        }
    }
    
    function reset() {
        _element.removeAttribute('class');
    }
    


    /* init */

    for (var i = 0; i < _polygon.points.length; i++) {
        var point = {
            x: getPxX(_polygon.points[i].x),
            y: getPxY(_polygon.points[i].y)
        }
        _points.push(point);
    }

    _element = document.createElementNS(svgns,'polygon');
    _element.setAttributeNS(null,'points',_points[0].x+','+_points[0].y+' '+_points[1].x+','+_points[1].y+' '+_points[2].x+','+_points[2].y+' '+_points[3].x+','+_points[3].y);
    playgroundElement.appendChild(_element);
    
    if (_onDemand) {
        updateDemand();
    }
    if (_team) {
        updateTeam();
    }
    
    polygons.push(this);




    /* Properties */

    Object.defineProperty(this, 'onDemand', {
    	get: function() { return _onDemand },
    	set: function(onDemand) {
            _onDemand = onDemand;
            updateDemand();
    	}
    });
    
    Object.defineProperty(this, 'team', {
    	get: function() { return _team },
    	set: function(team) {
            _team = team;
            updateTeam();
    	}
    });
    Object.defineProperty(this, 'reset', {
        get: reset
    });
    
    
    
} // end of Polygon()




function createPolygonElements(newPolygons) {
    while (playground.firstChild) { // delete polygons if there are some
        playground.removeChild(playground.firstChild);
    }
    for (var i = 0; i < newPolygons.length; i++) {
        new Polygon(newPolygons[i]);
    }
} // end of createPolygonElements()



function updatePolygons(newPolygons) {
    for (var i = 0; i < polygons.length; i++) { // update local polygons with server polygons (newPolygons)
        polygons[i].onDemand = newPolygons[i].onDemand;
        polygons[i].team = newPolygons[i].team;
    }
} // end of updatePolygons()



function updateScoreSet(scoreSet) { // wer das ließt ist doof.
    scoreTeam1Element.innerHTML = scoreSet[1];
    scoreTeam2Element.innerHTML = scoreSet[2];
} // end of updateScoreSet()



function showCanvasWin(winningTeam) {
    console.log('winning Team: '+winningTeam);
    document.body.classList.add('winTeam' + winningTeam); // screen takes color of winning team
    if (playerSelf.team === winningTeam) {
        win_screenTextElement.innerHTML = text.win[lang];
    } else {
        win_screenTextElement.innerHTML = text.lose[lang];
    }
    var secondsTillStart = 29;
    var secondsTillStartIntervalID = setInterval(function(){
        secondsTillStart--;
        win_screenSecondsElement.innerHTML = secondsTillStart;
        if (secondsTillStart <= 0) {
            // hide win_screen
            document.body.classList.remove('winTeam' + winningTeam);
            setTimeout(function(){ // clear text after transition
                win_screenElement.innerHTML = '';
            }, 500);
            clearInterval(secondsTillStartIntervalID);
        }
    }, 1000);
} // end of showCanvasWin



function rotateCanvas(deviceOrientationCompassHeading) {
    playersElement.setAttributeNS(null, 'transform', 'rotate(-'+deviceOrientationCompassHeading+' 160 160)');
    playgroundElement.setAttributeNS(null, 'transform', 'rotate(-'+deviceOrientationCompassHeading+' 160 160)');
}

