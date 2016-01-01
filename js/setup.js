/*




*/

/* Initialise all the variables! */

/* displayType takes one of three string values;
- room: shows the schedule for a room for the given day
- day: shows the schedule for a day
- current: shows all current presentations for now or next timeslots
*/
var displayType = null;

/* Update this URL to be the location the JSON data is sourced from */
var jsonURL = 'schedule.json';

/* Load in the JSON data */
var scheduleData = loadScheduleData(jsonURL);
console.log(scheduleData);


/* Initial setup actions based on the GET parameters */
var URLVars = getUrlVars();
console.log(URLVars['displayType']);
console.log(URLVars['room']);

/*

/* Determine what to show on the page */

switch (URLVars['displayType']) {
  case "room":
    displayRoom(URLVars['room'], scheduleData);
    break;

  case "day":
    displayDay();
    break;

  case "current":
    displayCurrent();
    break;

  default:
    /* if one of the above types is not selected, default to room */
    URLVars['displayType'] = 'room';
    displayRoom();
}



/* This function courtesy of http://papermashup.com/read-url-get-variables-withjavascript/ */
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

function loadScheduleData(jsonURL){
  var returnArray = null;

  $.ajaxSetup({
    async: false
  });

  $.getJSON(jsonURL)

    .done(function(scheduleData) {
     returnArray = scheduleData;
    })

    .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

  return returnArray;
}

function displayRoom(room, scheduleData) {

  $(document).ready(function(){
    $( "#title" ).append( " room " + decodeURI(room) );
  })

  var roomData =  new Array();
  var i = 0;

  $.each(scheduleData, function( key, value ) {

    if (decodeURI(value['Room Name']) == decodeURI(room)){
      // add to room
      console.log("entered if loop");
      roomData[i] = value;
      i ++;
    }
  });

  roomData = roomData.sort(sortRoomData);

  $.each(roomData, function( key, value ) {
    console.log(key);
    console.log(value);
  })



}


function sortRoomData(data1, data2){

  if (data1['Start'] > data2['Start']){
    return 1;
  } else {
    return -1;
  }

}


function displayDay() {

}

function displayCurrent() {

  $(document).ready(function(){
    $( "#title" ).append( " day " );
  })

}
