/* Initialise all the variables! */

/* Set the dates for comparison */
var Sunday    = moment("2016-01-31");
var Monday    = moment("2016-02-01");
var Tuesday   = moment("2016-02-02");
var Wednesday = moment("2016-02-03");
var Thursday  = moment("2016-02-04");
var Friday    = moment("2016-02-05");


var primaryVenue = 'Costa Hall';

/* Set how far ahead the 'current' listing looks */
var listingTimeAhead = 1; // value is in hours
var listingTimeBehind = 30; // value is in minutes

/* Update this URL to be the location the JSON data is sourced from */
var jsonURL = 'schedule.json';

/* Load in the JSON data */
var scheduleData = loadScheduleData(jsonURL);


/* Initial setup actions based on the GET parameters */
var URLVars = getUrlVars();

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
    displayCurrent(scheduleData, listingTimeAhead, listingTimeBehind);
    break;

  default:
    /* if one of the above types is not selected, default to room */
    URLVars['displayType'] = 'room';
    if(!URLVars['room']){
      URLVars['room'] = primaryVenue;
    }
    displayRoom(URLVars['room'], scheduleData, URLVars['day']);
}




/*
    CLOCK
    Courtesy of http://www.alessioatzeni.com/blog/css3-digital-clock-with-jquery/
*/

$(document).ready(function() {
// Create two variable with the names of the months and days in an array
var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

// Create a newDate() object
var newDate = new Date();
// Extract the current date from Date object
newDate.setDate(newDate.getDate());
// Output the day, date, month and year
$('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

setInterval( function() {
	// Create a newDate() object and extract the seconds of the current time on the visitor's
	var seconds = new Date().getSeconds();
	// Add a leading zero to seconds value
	$("#sec").html(( seconds < 10 ? "0" : "" ) + seconds);
	},1000);

setInterval( function() {
	// Create a newDate() object and extract the minutes of the current time on the visitor's
	var minutes = new Date().getMinutes();
	// Add a leading zero to the minutes value
	$("#min").html(( minutes < 10 ? "0" : "" ) + minutes);
    },1000);

setInterval( function() {
	// Create a newDate() object and extract the hours of the current time on the visitor's
	var hours = new Date().getHours();
	// Add a leading zero to the hours value
	$("#hours").html(( hours < 10 ? "0" : "" ) + hours);
    }, 1000);

});


/*
    FUNCTIONS
*/

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
    if (scheduleDay){
      $( "#title" ).append(" for " + scheduleDay);
    }
  })

  var roomData =  new Array();
  var i = 0;

  $.each(scheduleData, function( key, value ) {

    if (decodeURI(value['Room Name']) == decodeURI(room)){

      // if scheduleDay is set, add the room if it matches the day
      // otherwise we add the room

      if (!scheduleDay){
        // scheduleDay is not set
        // add to room
        roomData[i] = value;
        i ++;
      } else
      {

        var compareDay = moment(value['Start']).date();
        console.log(compareDay);

        switch (scheduleDay){

          case "Sunday":
            var scheduleDayCompare = moment(Sunday).date();
            break;

          case "Monday":
            var scheduleDayCompare = moment(Monday).date();
            break;

          case "Tuesday":
            var scheduleDayCompare = moment(Tuesday).date();
            break;

          case "Wednesday":
            var scheduleDayCompare = moment(Wednesday).date();
            break;

          case "Thursday":
            var scheduleDayCompare = moment(Thursday).date();
            break;

          case "Friday":
            var scheduleDayCompare = moment(Friday).date();
            break;

          }

          // and now we add the room to the roomData if the day matches
          if (compareDay == scheduleDayCompare){
            roomData[i] = value;
            i ++;
          }


        }
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
    // If Presenter is undefined, replace with a hyphen
    if (!value['Presenters']){
      value['Presenters'] = '-'
    }
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

function displayCurrent(scheduleData, listingTimeAhead, listingTimeBehind) {

  $(document).ready(function(){
    $( "#title" ).append( " upcoming events " );
  })

  var durationAhead = new moment.duration(listingTimeAhead, 'hours');
  var durationBehind = new moment.duration(listingTimeBehind, 'minutes');

  // using this for testing
  // for production you should use the current time
  var windowTimeEnd  = new moment('2016-02-02 15:15:00').add(durationAhead);
  var windowTimeStart = new moment('2016-02-02 15:15:00').add(-durationBehind);

  //var windowTimeEnd  = moment().add(durationAhead);
  //var windowTimeStart = moment().subtract(durationBehind);

  var roomData =  new Array();
  var i = 0;

  console.log ('before scheduleData');

  $.each(scheduleData, function( key, value ) {
    //compare dates and times to see whether
    var compareTime = new moment(value['Start']);

    if ((compareTime.isBefore(windowTimeEnd)) &&
        (compareTime.isAfter(windowTimeStart))){
      // then we want to show the events

      roomData[i] = value;
      i ++;

   }

  });

  roomData = roomData.sort(sortRoomData);

  // now we loop through data and we pull out events
  var listHTML = '';
  listHTML += "<table " + "id=\"scheduleTable\"" + ">";
  listHTML += "<tr>";
  listHTML += "<th>Day and time</th>";
  listHTML += "<th>Title</th>";
  listHTML += "<th>Presenter</th>";
  listHTML += "<th>Venue</th>";
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
    // If Presenter is undefined, replace with a hyphen
    if (!value['Presenters']){
      value['Presenters'] = '-'
    }
    listHTML += "<td class=\"displayPresenter\">"  + value['Presenters']+ "</td>";

    // Venue
    listHTML += "<td class=\"displayVenue\">"  + value['Room Name']+ "</td>";

    listHTML += "</tr>";
  })

  $(document).ready(function(){
    $("#schedule").append(listHTML);
  })

}
