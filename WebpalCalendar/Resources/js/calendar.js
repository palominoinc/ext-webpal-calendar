 /* ------ CALENDAR WIDGET ---------------
      more info at: http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/
      */

      jQuery(function($) {

            var button = '<button id="closeButton" type="button" class="btn btn-sm btn-success">Close</button>'
            $(button).appendTo('.main-section-content');
            $('#closeButton').hide();

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

                  events: '/event/fetch/all',

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

                        if($extraEventClass) copiedEventObject['className'] = [$extraEventClass];

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
                        var all_day = !(['fc-bg','fc-time','fc-widget-content','fc-content'].indexOf(jsEvent.target.className) >= 0);
                        var event = {

                                          start: start,
                                          end: end,
                                          allDay: all_day,
                                          className: 'label-info'
                                    };

                        //open dialog to create a new event
                        // bootbox.prompt("New Event Title:", function(title) {
                        //       if (title !== null) {
                        //             event = {
                        //                   title: title,
                        //                   start: start,
                        //                   end: end,
                        //                   allDay: all_day,
                        //                   className: 'label-info'
                        //             };

                        //             //render event
                        //             calendar.fullCalendar('renderEvent', event, true); // true - make the event "stick"

                        //             //post event
                        //              $.ajax({
                        //                   type: "POST",
                        //                   url: "/event/add",
                        //                   data: {
                        //                         title: title,
                        //                         start_date: start.format("YYYY-MM-DD"),
                        //                         start_time: start.format("HH:mm:ss"),
                        //                         end_date: end.format("YYYY-MM-DD"),
                        //                         end_time: end.format("HH:mm:ss"),
                        //                         allDay: all_day,
                        //                         className: 'label-info'
                        //                   }
                        //             });

                        //       }
                        // });

                        var modal ='\
                        <div class="modal fade">\
                        <div class="modal-dialog">\
                        <div class="modal-content">\
                        <div class="modal-body">\
                        <button type="button" class="close" data-dismiss="modal" style="margin-top:-10px;"></button>\
                        <div class="no-margin">\
                        <div class="row ">  \
                              <div class="col-md-12"> \
                                    <form class="form-horizontal"> \
                                          <div class="form-group"> \
                                                <label class="col-md-4 control-label" for="title">Title</label> \
                                                <div class="col-md-4 input-group"> \
                                                      <input id="title" name="title" type="text" placeholder="Event title" class="form-control"/> \
                                                </div> \
                                          </div> \
                                          <div class="form-group"> \
                                                <label class="col-md-4 control-label" for="description">Description</label> \
                                                <div class="col-md-4 input-group"> \
                                                      <textarea class="form-control" rows="4" cols="20" id="description" placeholder="Event description"/>\
                                                </div> \
                                          </div> \
                                          <div class="form-group"> \
                                          <div class="col-md-4 col-md-offset-4 input-group"> \
                                          <input class="" type="checkbox" id="allDayCheckbox" name="allDayCheckbox" value="AllDay">All Day Event<br>\
                                          </div>\
                                          </div>\
                                          <div id="datetime">\
                                          <div class="form-group"> \
                                                <label class="col-md-4 control-label" for="start_date">Pick a start date</label>\
                                                <div class="col-md-4 input-group"> \
                                                      <input id="start_date" class="form-control datepicker date start" data-provide="datepicker" data-date-format="yyyy-mm-dd" value="' + start.format("YYYY-MM-DD") + '"/>\
                                                      <label for="start_date" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>\
                                                </div>\
                                          </div>\
                                          <div class="form-group">\
                                                <label class="col-md-4 control-label" for="start_time">Pick a start time</label>\
                                                <div class="col-md-4 input-group"> \
                                                      <input type="text" id="start_time" class="form-control timepicker time start" name="start_time"  value="' +  start.format("HH:mm") + '">\
                                                      <label for="start_time" class="input-group-addon"><span class="glyphicon glyphicon-time"></span></label>\
                                                 </div>\
                                          </div>\
                                          <div class="form-group"> \
                                                <label class="col-md-4 control-label" for="end_date">Pick a end date</label>\
                                                <div class="col-md-4 input-group"> \
                                                      <input id="end_date" class="form-control datepicker date end" data-provide="datepicker" data-date-format="yyyy-mm-dd" value="' + end.format("YYYY-MM-DD") + '"/>\
                                                      <label for="end_date" class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></label>\
                                                </div>\
                                          </div>\
                                          <div class="form-group">\
                                                <label class="col-md-4 control-label" for="end_time">Pick a end time</label>\
                                                <div class="col-md-4 input-group"> \
                                                      <input type="text" id="end_time" class="form-control timepicker time end" name="end_time"  value="' +  end.format("HH:mm") + '">\
                                                      <label for="start_time" class="input-group-addon"><span class="glyphicon glyphicon-time"></span></label>\
                                                 </div>\
                                          </div>\
                                          </div>\
                                          <div>\
                                          \
                                          </div>\
                                          <div class="modal-footer">\
                                           <button type="submit" class="btn btn-sm btn-success"><i class="ace-icon fa fa-check"></i> Save</button>\
                                          <button type="button" class="btn btn-sm" data-dismiss="modal"><i class="ace-icon fa fa-times"></i> Cancel</button>\
                                          </div>\
                                    </form> \
                              </div> \
                        </div>\
                        </div>\
                        </div>\
                        </div>\
                        </div>\
                        ';

                         var modal = $(modal).appendTo('body');

                        //set all day checkbox
                         $("#allDayCheckbox").prop('checked', all_day);

                        modal.find('.datepicker').datepicker({
                               'showDuration': true,
                               'autoclose': true
                        });
                        // $('.datepicker').datepicker('update');
                        // $('.datepicker').val('');

                        modal.find(".datepicker").on("change", function () {
                           //maybe some validation
                        });

                        //initialize time picker
                        modal.find('.time').timepicker({
                          'showDuration': true,
                          'timeFormat': 'g:i a'
                        });



                        // initialize datepair
                        var basicExampleEl = document.getElementById('datetime');
                        var datepair = new Datepair(basicExampleEl);

                        modal.on('shown.bs.modal' , function(){$('#title').focus()});

                        modal.find('form').on('submit', function(ev){
                              ev.preventDefault();
                              createNewEvent(event);
                              //hide the dialog
                              modal.remove();
                        });

                        //on close
                        modal.modal('show').on('hidden', function(){
                              modal.remove();
                        });

                        modal.on('hide.bs.modal', function(e){
                               if (e.target === this){
                                    modal.remove();
                               }
                        });




                        calendar.fullCalendar('unselect');

                  }
                  ,

                  //edits an existing event
                  eventClick: function(calEvent, jsEvent, view) {

                        $('#closeButton').show();

                         $.get("/event/edit/" + calEvent.id, function( data ) {
                                    //$( "body" ).html( data );
                                    $(data).insertBefore( "#closeButton" );
                              }
                        );

                        //console.log(page['responseText']);

                        calendar.hide();
                        //$(page).appendTo('body');


                        //display a modal dialog
                        var modal =
                        '<div class="modal fade">\
                        <div class="modal-dialog">\
                        <div class="modal-content">\
                        <div class="modal-body">\
                        <button type="button" class="close" data-dismiss="modal" style="margin-top:-10px;"></button>\
                        <form class="no-margin">\
                        <label>Change event name </label>\
                        <input id="title" class="middle" autocomplete="off" type="text" value="' + calEvent.title + '" />\
                        <button type="submit" class="btn btn-sm btn-success"><i class="ace-icon fa fa-check"></i> Save</button>\
                        </form>\
                        </div>\
                        <div class="modal-footer">\
                        <button type="button" class="btn btn-sm btn-danger" data-action="delete"><i class="ace-icon fa fa-trash-o"></i> Delete Event</button>\
                        <button type="button" class="btn btn-sm" data-dismiss="modal"><i class="ace-icon fa fa-times"></i> Cancel</button>\
                        </div>\
                        </div>\
                        </div>\
                        </div>';


                        var modal = $(modal).appendTo('body');

                        $('#title').focus();

                        //on save
                        modal.find('form').on('submit', function(ev){
                              ev.preventDefault();
                              switchToCalendarView();

                              //update event parameters
                              calEvent.title = $(this).find("input[type=text]").val();
                              calendar.fullCalendar('updateEvent', calEvent);


                              //post event (saves to the database)
                              $.ajax({
                                    type: "POST",
                                    url: "/event/edit/" + calEvent.id,
                                    data: {
                                          title: calEvent.title,
                                          start_date: calEvent.start.format("YYYY-MM-DD"),
                                          start_time: calEvent.start.format("HH:mm:ss"),
                                          end_date: !calEvent.end ? '' : calEvent.end.format("YYYY-MM-DD"),
                                          end_time: !calEvent.end ? '' :  calEvent.end.format("HH:mm:ss"),
                                          allDay: calEvent.allDay,
                                          className: calEvent.className.toString()
                                    }
                              });

                              //remove the dialog
                              modal.remove();


                        });

                        //on delete
                        modal.find('button[data-action=delete]').on('click', function() {

                              switchToCalendarView();

                              //delete from the database
                               $.ajax({
                                    type: "POST",
                                    url: "/event/delete/" + calEvent.id,
                              });

                              //remove the event from the calendar
                              calendar.fullCalendar('removeEvents' , function(ev){
                                    return (ev._id == calEvent._id);
                              })

                              //remove the dialog
                              modal.remove();

                        });

                        //get focus on title input
                        modal.on('shown.bs.modal' , function(){$('#title').focus()});

                        //on close remove modal
                        modal.modal('show').on('hidden', function(){
                              modal.remove();
                        });
                        modal.on('hide.bs.modal', function(){
                              modal.remove();
                        });

                        //close button leads back to calendar view
                        $('#closeButton').on('click', function (ev){
                              ev.preventDefault();
                              switchToCalendarView();
                        })

                         //console.log(calEvent.className.toString());
                         //console.log(calEvent);
                        // console.log(jsEvent);
                        // console.log(view);

                  }



            });

            function switchToCalendarView(){
                  calendar.show();
                  $('#edit-event').remove();
                  $('#closeButton').hide();
            }

            function createNewEvent(event){
                  var title = $('#title').val();
                  var description =  $('textarea#description').val();
                  var start_date = moment($('#start_date').val(), "YYYY-MM-DD");
                  var start_time = moment($('#start_time').val(), "h:mm a");
                  var end_date = moment($('#end_date').val(), "YYYY-MM-DD");
                  var end_time = moment($('#end_time').val(), "h:mm a");
                  var allDay = $('#allDayCheckbox').is(':checked');

                  if (title !== '') {
                        event.title = title;
                        event.description = description;
                        event.start_date = start_date;
                        event.start_time = start_time;
                        event.end_time = end_time;
                        event.end_date = end_date;
                        event.allDay = allDay;


                        //post event
                        var response = $.ajax({
                              type: "POST",
                              url: "/event/add",
                              data: {
                                    title:  event.title,
                                    start_date:  event.start_date.format("YYYY-MM-DD"),
                                    start_time:  event.start_time.format("HH:mm:ss"),
                                    end_date:  event.end_date.format("YYYY-MM-DD"),
                                    end_time:  event.end_time.format("HH:mm:ss"),
                                    allDay:  event.allDay,
                                    className:  event.className,
                                    description: event.description
                              },
                              success: function(){
                                    //render event
                                    // calendar.fullCalendar('renderEvent', event, true); // true - make the event "stick"
                                    calendar.fullCalendar( 'refetchEvents' );
                              }
                        });






                  }

            }

      })

