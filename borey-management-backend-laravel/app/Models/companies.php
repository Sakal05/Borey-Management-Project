<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Companies extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_name',
        'username',
        'email',
        'password',
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
        static::creating(function ($company) {
            $company->company_id = static::generateCompanyId();
        });
    }

    /**
     * Generate a unique company ID starting with "0001."
     *
     * @return string
     */
    protected static function generateCompanyId()
    {
        $lastCompany = static::orderByDesc('id')->first();
        if ($lastCompany) {
            $lastCompanyId = (int) ltrim($lastCompany->company_id, '0');
            $nextCompanyId = str_pad($lastCompanyId + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextCompanyId = '0001';
        }

        return $nextCompanyId;
    }

}
