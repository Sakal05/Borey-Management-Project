<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_info extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $fillable = ['user_id', 'username', 'fullname', 'email', 'path', 'dob', 'gender', 'phonenumber', 'house_type', 'house_number', 'street_number'];

}
