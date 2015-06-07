/* WATCH POSITION */

setInterval(function(){
    navigator.geolocation.getCurrentPosition(function(e){
        var mercX = getMercX(e.coords.longitude);
    	var mercY = getMercY(e.coords.latitude);
        var position = {
            x: mercX,
            y: mercY
        }
                
        updatePosition(position);
        
        // set errors to false
        activate_gps = false;
        error_gps_position_unavailable = false;
        error_gps_permission_denied = false;
        
    },function(e){
        if (e.code === e.PERMISSION_DENIED) {
            error_gps_permission_denied = true;
        }
        if (e.code === e.POSITION_UNAVAILABLE) {
            error_gps_position_unavailable = true;
        }
        console.warn(e.code,': ',e.message)  
    },{enableHighAccuracy:true, maximumAge:500, timeout:1000});
}, 1000);




window.addEventListener('deviceorientation',function(e){
    var deviceOrientationCompassHeading = (e.webkitCompassHeading !== undefined) ? e.webkitCompassHeading : 0;
    rotateCanvas(deviceOrientationCompassHeading);
}); // device orientation


