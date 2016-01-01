

$(document).ready(function(){

  $.getJSON("schedule.json")


    .done(function(scheduleData) {

      var items = [];
      $.each( scheduleData, function( key, val ) {


        items.push( "<li id='" + key + "'>" + val.Title + ': ' + val.Description + "</li>" );
      });
/*
      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "#schedule" ); */
    })

    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );

  });
});
