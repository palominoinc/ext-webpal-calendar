 /* ------ CALENDAR WIDGET ---------------
      more info at: http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/
      */

      jQuery(function($) {


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
                        var event;

                        //open dialog to create a new event
                        bootbox.prompt("New Event Title:", function(title) {
                              if (title !== null) {
                                    event = {
                                          title: title,
                                          start: start,
                                          end: end,
                                          allDay: all_day,
                                          className: 'label-info'
                                    };

                                    //render event
                                    calendar.fullCalendar('renderEvent', event, true); // true - make the event "stick"

                                    //post event
                                     $.ajax({
                                          type: "POST",
                                          url: "/event/add",
                                          data: {
                                                title: title,
                                                start_date: start.format("YYYY-MM-DD"),
                                                start_time: start.format("HH:mm:ss"),
                                                end_date: end.format("YYYY-MM-DD"),
                                                end_time: end.format("HH:mm:ss"),
                                                allDay: all_day,
                                                className: 'label-info'
                                          }
                                    });

                              }
                        });

                        calendar.fullCalendar('unselect');

                  }
                  ,

                  //edits an existing event
                  eventClick: function(calEvent, jsEvent, view) {

                        //display a modal dialog
                        var modal =
                        '<div class="modal fade">\
                        <div class="modal-dialog">\
                        <div class="modal-content">\
                        <div class="modal-body">\
                        <button type="button" class="close" data-dismiss="modal" style="margin-top:-10px;"></button>\
                        <form class="no-margin">\
                        <label>Change event name </label>\
                        <input class="middle" autocomplete="off" type="text" value="' + calEvent.title + '" />\
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

                        //on save
                        modal.find('form').on('submit', function(ev){
                              ev.preventDefault();

                              //update event parameters
                              calEvent.title = $(this).find("input[type=text]").val();
                              calendar.fullCalendar('updateEvent', calEvent);

                              //hide the dialog
                              modal.modal("hide");

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

                        });

                        //on delete
                        modal.find('button[data-action=delete]').on('click', function() {


                              //delete from the database
                               $.ajax({
                                    type: "POST",
                                    url: "/event/delete/" + calEvent.id,
                              });

                              //remove the event from the calendar
                              calendar.fullCalendar('removeEvents' , function(ev){
                                    return (ev._id == calEvent._id);
                              })


                              //hide the dialog
                              modal.modal("hide");
                        });

                        //on close
                        modal.modal('show').on('hidden', function(){
                              modal.remove();
                        });



                         //console.log(calEvent.className.toString());
                         //console.log(calEvent);
                        // console.log(jsEvent);
                        // console.log(view);

                  }

            });

      })