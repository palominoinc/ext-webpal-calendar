<?php

/*
 *
 */

namespace WebpalCalendar\Controllers;

use BaseController;
use View;
use Redirect;
use Input;
use Config;
use DateTimeImmutable;
use DateTime;
use DateInterval;
use DB;
use Session;
use Log;
use Response;
use Purifier;

use WebpalCalendar\Models\Event;

use PahealthApp\Models\WebPalUser;
use PahealthApp\Models\WebPalGroup;

use WebpalLogin\Source\WebPalAPI\Connection;

class EventController extends BaseController
{
	/**
   *
   */
  public function __construct() {

  }


  /**
   * create a new event record in the database
   * @return Response (json with status and new event)
   */
  public function addRecord()
  {
    return $this->updateEvent(new Event());
 }
  /**
   * update event record in the database
   * @return Response (json with status and new event)
   */
  public function editRecord($id)
  {
    return $this->updateEvent(Event::find($id));
  }

  /**
   * deletes an event record with given id from the database
   */
  public function deleteRecord($id)
  {
      Event::destroy($id);
  }

  /**gets all events from the database
  * @return array of events
  */
  public function fetchRecords()
  {

     $level = $this->getLevel();
     // $level = 4;
     Log::info('level', $level);

     //get all the events with the level below user's level
     $events = Event::where('level', '<=', $level)->get();

     //transform start and end date and time to fullCalendar's format
     foreach ($events as $event){

      //set start date and time
      $start = $event->start_date;
      if ($event->start_time){
        $start = $start.'T'.$event->start_time;
      }
      $event->start =  $start;

      //set end date and time
      $end =  $event->end_date;
      if ($event->end_time){
        $end = $end.'T'.$event->end_time;
      }
      $event->end = $end;
     }

     return $events;
  }

  /**
   * returns the highest level assigned to the user
   * @return int highest user level
   */
  public function getUserLevel(){
     return  Response::json([ 'status' => 'ok', 'userLevel' => $this->getLevel() ]);
  }

//---------------------------------------------------
// -----------------private functions----------------
// --------------------------------------------------


 /** updates event in the database using input params
 *	@return Response (json with status and new event)
 */
  private function updateEvent(Event $event){
  	$event->update([
                    'title' => Purifier::clean(Input::get('title')),
                    'description' => Purifier::clean(Input::get('description')),
                    'start_date'=> $this->parseFormatDate(Input::get('start_date'), 'Y-m-d'),
                    'start_time'=> $this->parseFormatDate(Input::get('start_time'), 'H:i:s'),
                    'end_date'=> $this->parseFormatDate(Input::get('end_date'), 'Y-m-d'),
                    'end_time'=> $this->parseFormatDate(Input::get('end_time'), 'H:i:s'),
                    'allDay'=> Input::get('allDay') === 'true',
                    'className'=> $this->validateClass(Input::get('className')),
                    'level' => intVal(Input::get('level')),
                    'color' => $this->validateColor(Input::get('color'))
                    ]);

    return Response::json([ 'status' => 'ok', 'event' => $event->toArray(), ]);

  }

  /**
   * wraps date in DateTime and formats it to given format
   * @param  string $date   date to wrap
   * @param  string $format a format to use
   * @return  string (formatted)
   */
  private function parseFormatDate($date, $format){
  	return DateTime::createFromFormat($format, $date)->format($format);
  }

/**
 * [validateClass description]
 * @param  string $className a class to check
 * @return string            a valid class or an empty string
 */
  private function validateClass($className){
  	if (in_array($className, ['label-info'])){
  		return $className;
  	}
  	else{
  		return '';
  	}
  }

  private function validateColor ($color){
    if (in_array($color, ['red', 'green', 'blue', 'black', 'yellow', 'grey'])){
      return $color;
    }
    else{
      return '';
    }
  }

  private function getLevel(){
    $user = Connection::userInfo();

    if (strpos( $user['groups'], 'Level 4') !== false){
      return 4;
    };

    if (strpos( $user['groups'], 'Level 3') !== false){
      return 3;
    };

    if (strpos( $user['groups'], 'Level 2') !== false){
      return 2;
    };

    return 1;
  }
}
