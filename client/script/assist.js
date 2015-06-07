// Mercator
// http://wiki.openstreetmap.org/wiki/Mercator
function getMercX(lon) { // 11,3
    var r_major = 6378137.000;
    return r_major * ( lon * (Math.PI/180.0) );
}
function getMercY(lat) { // 50,9
	if (lat > 89.5) {
        lat = 89.5;
    }
    if (lat < -89.5) {
		lat = -89.5;
	}
    var r_major = 6378137.000;
    var r_minor = 6356752.3142;
    var temp = r_minor / r_major;
    var es = 1.0 - (temp * temp);
    var eccent = Math.sqrt(es);
    var phi = lat * (Math.PI/180.0);
    var sinphi = Math.sin(phi);
    var con = eccent * sinphi;
    var com = 0.5 * eccent;
    con = Math.pow((1.0-con)/(1.0+con), com);
    var ts = Math.tan(0.5 * (Math.PI*0.5 - phi))/con;
    var y = 0 - r_major * Math.log(ts);
    return y;	
}


function getPxX(mercX) {
    return Math.round(((canvasWidth/2)-((mercCenterOfPlayground.x-mercX)/zoom))*10)/10;
}
function getPxY(mercY) {
    return Math.round(((canvasHeight/2)+((mercCenterOfPlayground.y-mercY)/zoom))*10)/10;
}

