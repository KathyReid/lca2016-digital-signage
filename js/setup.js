/*




*/

/* Initialise all the variables! */

/* Set the dates for comparison */
var Monday    = moment("2016-02-01");
var Tuesday   = moment("2016-02-02");
var Wednesday = moment("2016-02-03");
var Thursday  = moment("2016-02-04");
var Friday    = moment("2016-02-05");

/* Update this URL to be the location the JSON data is sourced from */
var jsonURL = 'schedule.json';

/* Load in the JSON data */
var scheduleData = loadScheduleData(jsonURL);


/* Initial setup actions based on the GET parameters */
var URLVars = getUrlVars();
console.log(URLVars['displayType']);
console.log(URLVars['room']);
console.log(URLVars['day']);

/*

/* Determine what to show on the page */

/* displayType takes one of three string values;
- room: shows the schedule for a room for the given day
- current: shows all current presentations for now or next timeslots
*/
var displayType = null;

switch (URLVars['displayType']) {
  case "room":
    displayRoom(URLVars['room'], scheduleData, URLVars['day']);
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



function displayRoom(room, scheduleData, scheduleDay) {

  $(document).ready(function(){
    $( "#title" ).append( " room " + decodeURI(room) );
  })

  var roomData =  new Array();
  var i = 0;

  $.each(scheduleData, function( key, value ) {

    if (decodeURI(value['Room Name']) == decodeURI(room)){

      // if scheduleDay is set, add the room if it matches the day
      // otherwise we add the room


      
      // add to room
      roomData[i] = value;
      i ++;
    }
  });

  roomData = roomData.sort(sortRoomData);

  var listHTML = '';
  listHTML += "<table " + "id=\"scheduleTable\"" + ">";
  listHTML += "<tr>";
  listHTML += "<th>Day and time</th>";
  listHTML += "<th>Title</th>";
  listHTML += "<th>Presenter</th>";
  listHTML += "</tr>";

  $.each(roomData, function( key, value ) {

    // if this is the first entry for the day, do a table header

    listHTML += "<tr>";

    // Date and day
    var showDate = new moment(value['Start']);
    var showDuration = new moment.duration(value['Duration']);

    listHTML += "<td class=\"displayDate\">"  + showDate.format('ddd Do MMM HH:mm') + "<span class=\"displayDuration\"> "  + "(" + showDuration.asMinutes() + " mins)" + "</span>" + "</td>";

    // Title
    listHTML += "<td class=\"displayTitle\">"  + value['Title']+ "</td>";

    // Presenter
    listHTML += "<td class=\"displayPresenter\">"  + value['Presenters']+ "</td>";




    listHTML += "</tr>";


  })

  $(document).ready(function(){
    $("#schedule").append(listHTML);
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
