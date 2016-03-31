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
use Request;

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
    // $this->country_list = Config::get('misc.country_list');
    // $this->canadian_states = Config::get('misc.canadian_states');
    // $this->american_states = Config::get('misc.american_states');
    // $this->pa_counties = Config::get('misc.pa_counties');
    // $this->waiver_list = Config::get('misc.waiver_list');
    // $this->current_status_list = Config::get('misc.current_status');
  }

  /**
   *
   */
  public function showAddRecord()
  {
    // $data = [
    //   'country_list' => $this->country_list,
    //   'canadian_states' => $this->canadian_states,
    //   'american_states' => $this->american_states,
    //   'pa_counties' => $this->pa_counties,
    //   'waiver_list' => $this->waiver_list,
    //   'current_status_list' => $this->current_status_list,
    //   'coordinator_list' => ['' => 'Select Primary SC'] + $this->generateWebPalGroupArray('Service Coordinators'),
    //   'dss_coordinator_list' => ['' => 'Select DSS SC'] + $this->generateWebPalGroupArray('DSS Service Coordinators'),
    // ];

    // return View::make('PahealthApp::clients.add', $data);
  }

  /**
   *
   */
  public function showEditRecord($id)
  {
    // $client = Client::find($id);

    // if (!isset($client)) {
    //   return Redirect::route('listClients')->with('message', 'Invalid client!')->with('message_type', 'danger');
    // }

    // $services = Service::where('client_id', '=', $id);

    // $week = $this->getWeek();

    // if (!empty($week)) {
    //   $min_time = new DateTime();
    //   $min_time->setTimeStamp($week);
    //   // One week later
    //   $max_time = new DateTime();
    //   $max_time->setTimeStamp($week);
    //   $max_time->add(new DateInterval('P1W'));

    //   $services->where('start_at', '>=', $min_time->format('Y-m-d 00:00:00'))
    //     ->where('start_at', '<', $max_time->format('Y-m-d 00:00:00'));
    // }

    // $data = [
    //   'client' => $client,
    //   'services' => $services->get(),
    //   'country_list' => $this->country_list,
    //   'canadian_states' => $this->canadian_states,
    //   'american_states' => $this->american_states,
    //   'pa_counties' => $this->pa_counties,
    //   'waiver_list' => $this->waiver_list,
    //   'current_status_list' => $this->current_status_list,
    //   'coordinator_list' => ['' => 'Select Primary SC'] + $this->generateWebPalGroupArray('Service Coordinators'),
    //   'dss_coordinator_list' => ['' => 'Select DSS SC'] + $this->generateWebPalGroupArray('DSS Service Coordinators'),
    //   'weekList' => $this->weekList(),
    //   'object' => [
    //     'week' => $week
    //   ]
    // ];

    // return View::make('PahealthApp::clients.edit', $data);

  	$event = Event::find($id);
  	return View::make('PahealthApp::event.edit', ['event' => $event]);

  }

  /**
   * create a new event record in the database
   */
  public function addRecord()
  {
    // $client = new Client();

    // if (!$client->validate(Input::all())) {
    //   return Redirect::to('/client/add')->with('errors', $client->errors())->withInput();
    // }
    // $client->update(Input::all());

    // return Redirect::to('/client/edit/'.$client->id)->with('message', "Client: <strong>{$client->fullname()}</strong> has been created");

    $data = Request::get('data');
    $title = Request::get('title');
    $start_date = Request::get('start_date');
    $start_time = Request::get('start_time');
    $end_date = Request::get('end_date');
    $end_time = Request::get('end_time');
    $allDay = Request::get('allDay');
    $className = Request::get('className');

    // Log::info('data:'. $data);
    // Log::info('title:'. $title);
    // Log::info('start date:'. $start_date);
    // Log::info('start time:'. $start_time);
    // Log::info('end date:'. $end_date);
    // Log::info('end time:'. $end_time);
    // Log::info('allDay:'. $allDay);

    $event = new Event();
    $event->update(array(
    	'title' => $title,
    	'start_date'=> date('Y-m-d', strtotime($start_date)),
    	'start_time'=> date('H:i:s',strtotime($start_time)),
    	'end_date'=> date('Y-m-d', strtotime($end_date)),
    	'end_time'=> date('H:i:s', strtotime($end_time)),
    	'allDay'=> ($allDay == 'true') ? 1 : 0,
    	'className'=> $className
    ));
  }

  /**
   * update event record in the database
   */
  public function editRecord($id)
  {
    // $client = Client::find($id);

    // if (!$client->validate(Input::all())) {
    //   return Redirect::to('client/edit/'.$id)->with('errors', $client->errors())->withInput();
    // }
    // $client->update(Input::all());

    // return Redirect::to('client/edit/'.$id)->with('message', "Client: <strong>{$client->fullname()}</strong> has been updated");

    $data = Request::get('data');
    $title = Request::get('title');
    $start_date = Request::get('start_date');
    $start_time = Request::get('start_time');
    $end_date = Request::get('end_date');
    $end_time = Request::get('end_time');
    $allDay = Request::get('allDay');
    $className = Request::get('className');

	Log::info('allDay:'. $allDay);

    $event = Event::find($id);

    $event->update(array(
    	'title' => $title,
    	'start_date'=> date('Y-m-d', strtotime($start_date)),
    	'start_time'=> date('H:i:s',strtotime($start_time)),
    	'end_date'=> date('Y-m-d', strtotime($end_date)),
    	'end_time'=> date('H:i:s', strtotime($end_time)),
    	'allDay'=> ($allDay == 'false') ? 0 : 1,
    	'className'=> $className
    ));
  }

  /**
   *
   */
  public function deleteRecord($id)
  {
  		Event::destroy($id);
  }

  /**
   *
   */
  public function listRecords()
  {
    // $data = [
    //   'clients' => Client::all(),
    // ];
    // return View::make('PahealthApp::clients.list', $data);

  }

  /**
   *
   */
  private function generateWebPalGroupArray($group_name)
  {
    // $map = [];

    // if (! empty($group_name)) {
    //   $session = Connection::get()->getAdminSession();
    //   $session->send('listUsers', [
    //     'search' => $group_name,
    //     'sort' => 'lastName'
    //   ]);

    //   foreach ($session->objectlistFromResponse('Result') as $row) {
    //     $map[(string) $row->id] = $row->name;
    //   }
    // }

    // return $map;
  }

  /**
   *
   */
  public function getWeek()
  {
    // $week = Input::get('week', Session::get('report_week', null));

    // if (! empty($week)) {
    //   Session::put('report_week', $week);
    // }

    // return $week;
  }

  /**
   *
   */
  public function weekList()
  {
    // $thisMonday = new DateTimeImmutable('monday this week');

    // return $this->weeksOptionsBuild($thisMonday, 14);
  }

  /**
   *
   */
  public function weeksOptionsBuild(DateTimeImmutable $ptr, $count)
  {
    // $options = [];

    // $options[''] = 'Select a week';
    // $week = new DateInterval('P1W');
    // $oneDay = new DateInterval('P1D');
    // $next = $ptr->add($week);

    // for ($i = 0; $i < $count; $i += 1) {
    //   $key = (string) $ptr->getTimeStamp();
    //   $val = $ptr->format('M j');
    //   $month = $ptr->format('M');

    //   $options[$key] = $ptr->format('M j') . ' - ' . $next->sub($oneDay)->format('M j');

    //   $next = $ptr;
    //   $ptr = $ptr->sub($week);
    // }

    // return $options;
  }

  //gets all events from the database
  public function fetchRecords()
  {
     $events = Event::all();
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
}
