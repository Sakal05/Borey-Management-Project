<?php

namespace App\Models;

use App\Models\User_Info;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'fullname',
        'email',
        'password',
        'company_id',
        'date_registered',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Boot the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function ($user) {
            $user->user_id = static::generateUserId();
        });
    }

    /**
     * Generate a unique user ID starting with "0001."
     *
     * @return string
     */
    protected static function generateUserId()
    {
        $lastUser = static::orderByDesc('id')->first();
        if ($lastUser) {
            $lastUserId = (int) ltrim($lastUser->user_id, '0');
            $nextUserId = str_pad($lastUserId + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextUserId = '0001';
        }

        return $nextUserId;
    }

    public function userInfo()
    {
        return $this->hasOne(User_Info::class, 'user_id');
    }

}
