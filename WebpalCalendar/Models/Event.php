<?php

/*
 *
 */

namespace WebpalCalendar\Models;

use Eloquent;
use Illuminate\Database\Eloquent\SoftDeletingTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Validator;
use DateTime;
use Purifier;
use Log;
use DB;


class Event extends Eloquent
{
	 use SoftDeletingTrait;
	 // use SoftDeletes;


  protected $table = 'webpal_calendar_events';
  public $timestamps = true;
  protected $dates = ['deleted_at'];

  private static $validations = [
                                  'title' => 'required|max:64'
                                 ];

  private $errors;

  /**
   *
   */
  public function validate($data)
  {
    $validator = Validator::make($data, self::$validations);

    if ($validator->fails()) {
      $this->errors = $validator->errors();

      return false;
    }
    return true;
  }

  /**
   *
   */
  public function errors()
  {
    return $this->errors;
  }

  /**
   * updates event in the database
   */
  public function update(array $data)
  {

  	$this->title = $data[ 'title' ];
  	$this->description = $data[ 'description' ];
  	$this->start_time = $data[ 'start_time' ];
  	$this->start_date = $data[ 'start_date' ];
  	$this->end_time = $data[ 'end_time' ];
  	$this->end_date = $data[ 'end_date' ];
  	$this->allDay = $data[ 'allDay' ];
    $this->className = $data[ 'className' ];
    $this->level = $data[ 'level' ];
  	$this->color = $data[ 'color' ];

    $this->save();

  }


}
