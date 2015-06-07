var socket = io.connect('http://tobiasfw.centaurus.uberspace.de:63439');



setInterval(function(){
    navigator.geolocation.getCurrentPosition(function(e){
        document.getElementById('latitude').innerHTML = e.coords.latitude;
        document.getElementById('longitude').innerHTML = e.coords.longitude;
        document.getElementById('accuracy').innerHTML = e.coords.accuracy;
    }, function(e){
        if (e.code === e.PERMISSION_DENIED) {
            console.error('geolocation permission denied');
        }
        if (e.code === e.POSITION_UNAVAILABLE) {
            console.error('geolocation position unavailable');
        }
        console.warn(e.code,': ',e.message);
    },{enableHighAccuracy: true, maximumAge: 500, timeout: 1000}); // end of geolocation watch position
},1000);



document.getElementById('saveLocation').onsubmit = function(e){
    var latitude = document.getElementById('latitude').innerHTML;
    var longitude = document.getElementById('longitude').innerHTML;
    var accuracy = document.getElementById('accuracy').innerHTML;
    var number = document.getElementById('number').value;
    var pointCoords = {
        point: number,
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy
    };
    console.log(pointCoords);
    socket.emit('pointCoords',pointCoords);
    e.preventDefault();
}