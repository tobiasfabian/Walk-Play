/* VARIABLES */

var activate_gps = true;
var error_gps_permission_denied = true;
var error_gps_position_unavailable = true;
var error_gps_wrong_position = true;
var error_socket_connection = true;
var error_kicked;

var loadingIndicator = new LoadingIndicator();



/* CHECK VARIABLES */
/* error handling */
setInterval(function(){
    if (error_gps_permission_denied === true) {
        showErrorMessage(text.error_gps_permission_denied,true);
    } else if (error_gps_position_unavailable === true) {
        showErrorMessage(text.error_gps_position_unavailable,true);
    } else if (error_gps_wrong_position === true) {
        showErrorMessage(text.error_gps_wrong_position,true);
    } else if (error_socket_connection === true) {
        showErrorMessage(text.error_socket_connection,true);
    } else if (activate_gps === true) {
        showErrorMessage(text.activate_gps,false);
    } else {
        hideErrorMessage();
    }
    if (error_kicked === true) {
        showErrorMessage(text.error_kicked,true);
    }
},500);




function showErrorMessage(message,error) {
    if (error === true) {
        exclamation_markElement.style.opacity = 1;
        notificationElement.classList.add('error');
        status_circle_innerElement.style.opacity = 0;
        loadingIndicator.isAnimating = false;
    } else {
        exclamation_markElement.style.opacity = 0;
        notificationElement.classList.remove('error');
        status_circle_innerElement.style.opacity = 1;
        loadingIndicator.isAnimating = true;
    }
    notificationElement.innerHTML = message[lang];
    info_screenElement.style.opacity = 1;
    status_circle.style.opacity = 1;
    playgroundElement.style.opacity = 0;
    scoreElement.style.opacity = 0;
    playersElement.style.opacity = 0;
}
function hideErrorMessage() {
    info_screenElement.style.opacity = 0;
    exclamation_markElement.style.opacity = 0;
    status_circle.style.opacity = 0;
    loadingIndicator.isAnimating = false;
    playgroundElement.style.opacity = 1;
    scoreElement.style.opacity = 1;
    playersElement.style.opacity = 1;
}




/* click on status_circle: reload page */
status_circle.onclick = function(){
    location.reload();
}



/* LoadingIndicator */

function LoadingIndicator() {

    var isAnimating;
    
    function startAnimatingInterval() {
        isAnimating = true;
        var x = 0;
        var animatingIntervalID = setInterval(function(){
            var r = - 7.5 * Math.cos(x) + 10.5;
            x = x + Math.PI/23;
            status_circle_innerElement.setAttribute('r',r);
            if (isAnimating === false && status_circle_innerElement.getAttribute('r') == 3) {
                clearInterval(animatingIntervalID);
            }
        }, 40);
    }
    
    if (isAnimating) {
        startAnimatingInterval();
    }
    
    Object.defineProperty(this, 'isAnimating', {
    	get: function() { return isAnimating; },
        set: function(isAnimatingNew) {
            if (isAnimating !== isAnimatingNew) {
                isAnimating = isAnimatingNew;
                if (isAnimating === true) {
                    startAnimatingInterval();
                }
            }
        }
    });   
    
} // end of LoadingIndicator()
