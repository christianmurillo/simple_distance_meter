var startPos;
var start_time;
var prevPos;
var curPos;
var end_time;
var elapsed_time;
var total_dist = 0;
var dist_btwn_pts;
var mi; //miles
var mph;
var watchId;
/*** For HTML5 Geolocation API see: http://www.w3schools.com/html/html5_geolocation.asp ***/
//Start tracking position
function startTracking(){
	if(navigator.geolocation){
		document.getElementById('startBtn').style.display = 'none';
		document.getElementById('stopBtn').style.display = 'inline';
		//Get Position
		navigator.geolocation.getCurrentPosition(showPosition, showError);
		//Watch Position -  Returns the current position of the user and continues to return updated position as the user moves
		watchId = navigator.geolocation.watchPosition(showPositionUpdate,showError);
	} else {
		alert('Geolocation is not supported by your browser');
	}
}

//Show start position
function showPosition(position){
	startPos = position;
	document.getElementById('startLat').innerHTML = startPos.coords.latitude;
	document.getElementById('startLon').innerHTML = startPos.coords.longitude;
	/*** The timestamp attribute represents the time when the Position object was acquired and is
	represented as a DOMTimeStamp. A DOMTimeStamp represents a number of milliseconds. ***/
	start_time = startPos.timestamp;
	//document.getElementById('starttime').innerHTML = start_time;
	prevPos = startPos;
}

//Updated position
function showPositionUpdate(position){
	curPos = position;
	document.getElementById('currentLat').innerHTML = position.coords.latitude;
	document.getElementById('currentLon').innerHTML = position.coords.longitude;
	dist_btwn_pts = calculateDistance(prevPos.coords.latitude,prevPos.coords.longitude,curPos.coords.latitude,curPos.coords.longitude);
	total_dist = total_dist + dist_btwn_pts;
	prevPos = curPos; //change for next time user moves find dist between prev and current
	document.getElementById('distance').innerHTML = total_dist;
	//convert km to miles and display
	mi = total_dist * 0.621371;
	document.getElementById('miles').innerHTML = 	mi;
}

//Error handler
function showError(error){
	switch(error.code){
		case error.PERMISSION_DENIED:
			alert('User denied the request for Geolocation');
			break;
		case error.POSITION_UNAVAILABLE:
			alert('Location not available');
			break;
		case error.TIMEOUT:
			alert('The request has timed out');
			break;
		case error.UNKNOWN_ERROR:
			alert('There was an unknown error');
			break;
	}
}

//Calculate the distance between prev and current
//using the ‘haversine’ formula to calculate the great-circle distance between two points
//see: http://www.movable-type.co.uk/scripts/latlong.html
function calculateDistance(lat1, lon1, lat2, lon2) {
 	var R = 6371; // km
  	var dLat = (lat2-lat1).toRad();
  	var dLon = (lon2-lon1).toRad();
  	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  	var d = R * c;
  	return d;
}
Number.prototype.toRad = function(){
	return this * Math.PI / 180;
}

//Stop tracking
function stopTracking(){
	navigator.geolocation.clearWatch(watchId);
	//alert('Tracking Has Stopped');
	document.getElementById('stopBtn').style.display = 'none';
	document.getElementById('startBtn').style.display = 'inline';
	end_time = curPos.timestamp;
	//document.getElementById('endtime').innerHTML = end_time;
	//calculate mph
	elapsed_time = end_time - start_time; //milliseconds
	var hr = elapsed_time * 0.000000277778; //convert milliseconds to hr
	mph = mi / hr;
	document.getElementById('speed').innerHTML = mph;
}
