<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class postcomment extends Model
{
    protected $fillable = [
        'company_id',
        'post_id',
        'content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
