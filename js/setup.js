/*




*/

/* Initialise all the variables! */

/* displayType takes one of three string values;
- room: shows the schedule for a room for the given day
- day: shows the schedule for a day
- current: shows all current presentations for now or next timeslots
*/
var displayType = null;

/* Initial setup actions based on the GET parameters */
var URLVars = getUrlVars();
console.log(URLVars);

switch (URLVars['displayType']) {
  case "room":
    displayRoom();
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

function displayRoom() {

  $(document).ready(function(){
    $( "#title" ).append( " room " );
  })

}



function displayDay() {

}

function displayCurrent() {

  $(document).ready(function(){
    $( "#title" ).append( " day " );
  })

}
