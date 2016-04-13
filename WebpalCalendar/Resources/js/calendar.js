/* ------ CALENDAR WIDGET ---------------
*      more info at: http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/
*/
jQuery(function($) {

  const colorLabelTable = {
    red: 'Red',
    darkblue: 'Dark Blue',
    black: 'Black',
    purple: 'Purple'
  };

  const ColorInputLabel = 'Color';

  $('#external-events div.external-event').each(function() {
    // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
    // it doesn't need to have a start or end
    var eventObject = {
      title: $.trim($(this).text()) // use the element's text as the event title
    };

    // store the Event Object in the DOM element so we can get to it later
    $(this).data('eventObject', eventObject);

    // make the event draggable using jQuery UI
    $(this).draggable({
      zIndex: 999,
      revert: true,      // will cause the event to go back to its
      revertDuration: 0  //  original position after the drag
    });
  });
  /* initialize the calendar
  -----------------------------------------------------------------*/

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();


  var calendar = $('#wp-calendar').fullCalendar({
    //isRTL: true,
    buttonHtml: {
      prev: '<i class="ace-icon fa fa-chevron-left"></i>',
      next: '<i class="ace-icon fa fa-chevron-right"></i>'
    },

    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },

    events: '/event/fetch',

    editable: false,
    droppable: false,

    // this allows things to be dropped onto the calendar
    drop: function(date, allDay) {
      // this function is called when something is dropped

      // retrieve the dropped element's stored Event Object
      var originalEventObject = $(this).data('eventObject');
      var $extraEventClass = $(this).attr('data-class');


      // we need to copy it, so that multiple events don't have a reference to the same object
      var copiedEventObject = $.extend({}, originalEventObject);

      // assign it the date that was reported
      copiedEventObject.start = date;
      copiedEventObject.allDay = allDay;

      console.log('Event object', copiedEventObject);

      if ($extraEventClass) {
        copiedEventObject['className'] = [$extraEventClass];
      }

      // render the event on the calendar
      // the last `true` argument determines if the event "sticks" ()
      $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

      // is the "remove after drop" checkbox checked?
      if ($('#drop-remove').is(':checked')) {
        // if so, remove the element from the "Draggable Events" list
        $(this).remove();
      }

    }
    ,
    selectable: true,
    selectHelper: true,

    //creates a new event
    select: function(start, end, jsEvent, view) {
      //determine if the event is an all-day event
      var all_day = ! (['fc-bg','fc-time','fc-widget-content','fc-content'].indexOf(jsEvent.target.className) >= 0);
      var event = {
        start: start,
        end: end,
        allDay: all_day,
        className: 'label-info'
      };

      //generate modal dialog without delete button
      initModal(event, false);



    }
    ,

    //edits an existing event
    eventClick: function(calEvent, jsEvent, view) {

      //generate modal dialog with delete button
      initModal(calEvent, true);

    }
  });

  //-----------------------------------------------------------------------
  //----------------------------Functions----------------------------------
  //-----------------------------------------------------------------------

  //updates or creates(if there is no id provided) a new event in the database
  function updateEvent(event) {

    event = gatherEventDetails(event);

    var url;

    if (!! event.id) {
      url = "/event/edit/" + event.id;
    } else {
     url = "/event/add";
    }



    //post event
    var response = $.ajax({
      type: "POST",
      url: url,
      data: {
        title:  event.title,
        start_date:  event.start_date.format("YYYY-MM-DD"),
        start_time:  event.start_time.format("HH:mm:ss"),
        end_date:  event.end_date.format("YYYY-MM-DD"),
        end_time:  event.end_time.format("HH:mm:ss"),
        allDay:  event.allDay,
        className:  event.className.toString(),
        description: event.description,
        level: event.level,
        color: event.color
      },
      success: function() {

                //update the calendar (needed to get an event id from the database)
                calendar.fullCalendar( 'refetchEvents' );

      }
    });

  }

  function gatherEventDetails(event) {
     //title - defaults to 'New Event'
     var title = $('#title').val();
     if (!title) {
      title = 'New Event';
    }

    //description - optional
    var description =  $('textarea#description').val();

    //set start day - defaults to today
    var raw_start_date = $('#start_date').val();
    if (!raw_start_date) {
      raw_start_date = moment().format('YYYY-MM-DD');
    }

    //if start time is empty, set to 0:00 am
    var raw_start_time = $('#start_time').val();
    if (!raw_start_time) {
      raw_start_time = '0:00 am';
    }
    var start_time = moment(raw_start_time, "h:mm a");

    //if end day is empty, set it to start day
    var raw_end_date = $('#end_date').val()
    if (!raw_end_date) {
      raw_end_date = raw_start_date;
    }
    var end_date = moment(raw_end_date, "YYYY-MM-DD");

    //if end time is empty, set to 11:59 pm
    var raw_end_time = $('#end_time').val();
    if (!raw_end_time) {
     raw_end_time = '11:59 pm'
   }
   var end_time = moment(raw_end_time, "h:mm a");

    //set all day
    var allDay = $('#allDayCheckbox').is(':checked');

    //set level
    var level = $('#level').val();

    //set color based on level
    // var color;
    // switch (level) {
    //   case '2':
    //   color = 'green';
    //   break;
    //   case '3':
    //   color = 'red';
    //   break;
    //   case '4':
    //   color = 'black';
    //   break;
    //   default:
    //   color ='';
    // }
    var color = $('#color').val();

    event.title = title;
    event.description = description;
    event.start_date = moment(raw_start_date, "YYYY-MM-DD");
    event.start_time = start_time;
    event.end_time = end_time;
    event.end_date = end_date;
    event.allDay = allDay;
    event.level = level;
    event.color = color;
    event.start = raw_start_date + 'T' + event.start_time.format("HH:mm:ss");
    event.end = raw_end_date + 'T' + event.end_time.format("HH:mm:ss");

    return event;

  }


  //generates a modal window code
  function getModal (event, needDeleteButton) {
    var title;

    if (needDeleteButton){
      title = 'Edit Event';
    }
    else {
      title = 'Create New Event';
    }

    var modal ='\
    <div class="modal fade">\
    <div class="modal-dialog">\
    <div class="modal-content">\
    <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
        <h4 class="modal-title">'

    modal += title;

    modal +=
    '</h4>\
    </div>\
    <div class="modal-body">\
    <button type="button" class="close" data-dismiss="modal" style="margin-top:-10px;"></button>\
    <div class="no-margin">\
    <div class="row ">  \
    <div class="col-md-12"> \
    <form class="form-horizontal"> \
    <div class="form-group"> \
    <label class="col-md-4 control-label" for="title">Title</label> \
    <div class="col-md-4 input-group"> \
    <input id="title" name="title" type="text" placeholder="Event title" class="form-control" value="';
    if (!! event.title) {
      modal += event.title;
    }

    modal += '"/> \
    </div> \
    </div> \
    <div class="form-group"> \
    <label class="col-md-4 control-label" for="description">Description</label> \
    <div class="col-md-4 input-group"> \
    <textarea class="form-control" rows="4" cols="20" id="description" placeholder="Event description">';
    if (!! event.description) {
      modal += event.description;
    }

    modal += '</textarea>\
    </div> \
    </div> \
    <div class="form-group"> \
    <div class="col-md-4 col-md-offset-4 input-group"> \
    <input class="" type="checkbox" id="allDayCheckbox" name="allDayCheckbox" value="AllDay"><label for="allDayCheckbox">All Day Event</label><br>\
    </div>\
    </div>\
    <div id="datetime">\
    <div class="form-group"> \
    <label class="col-md-4 control-label" for="start_date">Pick a start date</label>\
    <div class="col-md-4 input-group"> \
    <input id="start_date" class="form-control datepicker date start" data-provide="datepicker" data-date-format="yyyy-mm-dd" value="';
    if (!! event.start) {
      modal += event.start.format("YYYY-MM-DD");
    }

    modal +='"/>\
    <label for="start_date" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>\
    </div>\
    </div>\
    <div class="form-group">\
    <label class="col-md-4 control-label" for="start_time">Pick a start time</label>\
    <div class="col-md-4 input-group"> \
    <input type="text" id="start_time" class="form-control timepicker time start" name="start_time"  value="';
    if (!! event.start) {
      modal += event.start.format("HH:mm");
    }

    modal += '">\
    <label for="start_time" class="input-group-addon"><span class="glyphicon glyphicon-time"></span></label>\
    </div>\
    </div>\
    <div class="form-group"> \
    <label class="col-md-4 control-label" for="end_date">Pick a end date</label>\
    <div class="col-md-4 input-group"> \
    <input id="end_date" class="form-control datepicker date end" data-provide="datepicker" data-date-format="yyyy-mm-dd" value="';
    if (!! event.end) {
      modal += event.end.format("YYYY-MM-DD");
    }

    modal += '"/>\
    <label for="end_date" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>\
    </div>\
    </div>\
    <div class="form-group">\
    <label class="col-md-4 control-label" for="end_time">Pick a end time</label>\
    <div class="col-md-4 input-group"> \
    <input type="text" id="end_time" class="form-control timepicker time end" name="end_time"  value="';
    if (!! event.end) {
      modal +=  event.end.format("HH:mm");
    }

    modal += '">\
    <label for="end_time" class="input-group-addon"><span class="glyphicon glyphicon-time"></span></label>\
    </div>\
    </div>\
    </div>\
    <div class="form-group">\
    <label class="col-md-4 control-label" for="end_time">Calendar level</label>\
    <div class="col-md-4 input-group"> \
    <select id="level" class="form-control" name="level">\
    </select>\
    </div>\
    </div>\
    <div class="form-group">\
    <label class="col-md-4 control-label" for="color">' + ColorInputLabel + '</label>\
    <div class="col-md-4 input-group"> \
    <select id="color" class="form-control" name="color">\
    </select>\
    </div>\
    </div>\
    <div class="modal-footer">\
    <button type="submit" class="btn btn-sm btn-success"><i class="ace-icon fa fa-check"></i> Save</button>';

    if (needDeleteButton) {
      modal += '<button type="button" class="btn btn-sm btn-danger" data-action="delete"><i class="ace-icon fa fa-trash-o"></i> Delete Event</button>';
    }

    modal += '<button type="button" class="btn btn-sm" data-dismiss="modal"><i class="ace-icon fa fa-times"></i> Cancel</button>\
    </div>\
    </form> \
    </div> \
    </div>\
    </div>\
    </div>\
    </div>\
    </div>\
    ';
    return modal;
  }

  function setDisabledPropForTimeInputs (modal){
    if ( $("#allDayCheckbox").is(':checked')) {
        //disable time inputs
         modal.find('.time').prop('disabled', true);
      }
      else {
        //enable time inputs
         modal.find('.time').prop('disabled', false);

      }
  }

  function initModal(event, needDeleteButton) {

    var modalString = getModal(event, needDeleteButton);

    modal = $(modalString).appendTo('body');

    //initialize date picker
    modal.find('.datepicker').datepicker({
     'showDuration': true,
     'autoclose': true
    });

    modal.find(".datepicker").on("change", function() {
       //some validation
    });

    //initialize time picker
    modal.find('.time').timepicker({
      'showDuration': true,
      'timeFormat': 'g:i a'
    });


    // initialize datepair
    var basicExampleEl = document.getElementById('datetime');
    var datepair = new Datepair(basicExampleEl);

    //set all day checkbox
    $("#allDayCheckbox").prop('checked', event.allDay);

    setDisabledPropForTimeInputs (modal);

    $("#allDayCheckbox").change(function () {
      setDisabledPropForTimeInputs (modal);
    })

    //setup calendar level select
    var userLevel;
    $.get('/userlevel', function(data){
      userLevel = data.userLevel;

      //init select level options
      for (i = 1; i <= userLevel; i++) {
        $('#level')
          .append($('<option>', {value : i} )
          .text(i));
      }

      //select calendar level
      $('select option[ value=' + event.level + ' ]').attr("selected",true);

    });

    //set a color selector
    for (var key in colorLabelTable) {
        $('#color')
          .append($('<option>', {value : key} )
          .text(colorLabelTable[key]));
    };

    if (!event.color){
      event.color = 'red';
    }

    //select event color
    $('select option[ value=' + event.color + ' ]').attr("selected",true);

    //focus title field when dialog opens
    modal.on('shown.bs.modal' , function() { $('#title').focus() } );

    //on submit
    modal.find('form').on('submit', function(ev) {
      ev.preventDefault();

      updateEvent(event);

      if (!needDeleteButton) {
         calendar.fullCalendar('renderEvent', event);
      }

      //hide the dialog
      modal.remove();
      $('body').removeClass('modal-open');
    });

    //on close
    modal.modal('show').on('hidden', function() {
      modal.remove();
    });

    //if hidden - remove
    modal.on('hide.bs.modal', function(e) {
      if (e.target === this) {
        $('body').removeClass('modal-open');
        modal.remove();
      }
    });

    if (needDeleteButton) {
      //on delete
      modal.find('button[data-action=delete]').on('click', function() {

        // switchToCalendarView();

        //delete from the database
        $.ajax({
          type: "POST",
          url: "/event/delete/" + event.id,
        });

        //remove the event from the calendar
        calendar.fullCalendar('removeEvents' , function(ev) {
          return (ev._id === event._id);
        })

        //remove the dialog
        modal.remove();

      });
    }
  }
})