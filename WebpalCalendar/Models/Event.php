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
                                 // 'lastname' => 'required|max:30',
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
   *
   */
  public function update(array $data)
  {
    // $oldStatus = $this->status;

    // $this->firstname = Purifier::clean(trim($data['firstname']));
    // $this->lastname  = Purifier::clean(trim($data['lastname']));
    // $this->pahm_acct_num = Purifier::clean(trim($data['pahm_acct_num']));
    // $this->ma_num    = Purifier::clean(trim($data['ma_num']));
    // $this->ssn       = Purifier::clean(trim($data['ssn']));
    // $this->born_at = date('Y-m-d H:i:s', strtotime($data['born_at']));
    // $this->program_dx_code  =  Purifier::clean(trim($data['program_dx_code']));
    // $this->rate = Purifier::clean(trim($data['rate']));
    // $this->waiver    = Purifier::clean(trim($data['waiver']));
    // $this->phone_home  =  Purifier::clean(trim($data['phone_home']));
    // $this->phone_mobile = Purifier::clean(trim($data['phone_mobile']));
    // $this->contact_emerg = Purifier::clean(trim($data['contact_emerg']));
    // $this->phone_contact_emerg = Purifier::clean(trim($data['phone_contact_emerg']));
    // $this->address = Purifier::clean(trim($data['address']));
    // $this->address2 = Purifier::clean(trim($data['address2']));
    // $this->city = Purifier::clean(trim($data['city']));
    // $this->postalcode = Purifier::clean(trim($data['postalcode']));
    // $this->state = Purifier::clean(trim($data['state']));
    // $this->county = Purifier::clean(trim($data['county']));
    // $this->status = Purifier::clean(trim($data['status']));
    // $this->started_at = date('Y-m-d H:i:s', strtotime($data['started_at']));
    // $this->left_at = date('Y-m-d H:i:s', strtotime($data['left_at']));
    // $this->phone_mobile = Purifier::clean(trim($data['phone_mobile']));
    // $this->coordinator_id = Purifier::clean(trim($data['coordinator_id']));
    // $this->dss_coordinator_id = Purifier::clean(trim($data['dss_coordinator_id']));

    // $this->pers_check = $data['pers_check'];
    // $this->trans_check = $data['trans_check'];
    // $this->ptot_check = $data['ptot_check'];
    // $this->dme_check = $data['dme_check'];
    // $this->comunity_check = $data['comunity_check'];
    // $this->home_check = $data['home_check'];
    // $this->vehicle_check = $data['vehicle_check'];
    // $this->assitive_check = $data['assitive_check'];

    // $this->email = $data['email'];
    // $this->notes = Purifier::clean(trim($data['notes']));

  	$this->title = $data['title'];
  	$this->start_time = $data['start_time'];
  	$this->start_date = $data['start_date'];
  	$this->end_time = $data['end_time'];
  	$this->end_date = $data['end_date'];
  	$this->allDay = $data['allDay'];
  	$this->className = $data['className'];


    $this->save();

    // $this->logStatus($oldStatus, $data['status']);
  }


  /**
   * If the status changes, modify the status log
   * to record the change
   */
  // private function logStatus($oldStatus, $newStatus)
  // {
  //   if ($oldStatus !== $newStatus) {
  //     // Mark previous status as superceded
  //     DB::update('update event_log set updated_at = date(now()) where superceded_at is null and client_id=?', [ $this->id ]);
  //     // Insert new record
  //     DB::insert('insert into client_status_log (client_id, status, changed_at, superceded_at) values (?, ?, date(now()), null)', [ $this->id, $newStatus ]);
  //   }
  // }

  /**
   *
   */
 //  public function fullname()
 //  {
 //    $full_name = '';
 //    if (isset($this->firstname)) {
 //      $full_name = $this->firstname;
 //    }
 //    if (isset($this->lastname)) {
 //      $full_name .= ' '.$this->lastname;
 //    }
 //    return $full_name;

 // }

  // public function services()
  // {
  //   return $this->hasMany('PahealthApp\Models\Service');
  // }
}
