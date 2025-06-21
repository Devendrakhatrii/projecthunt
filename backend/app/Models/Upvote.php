<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Upvote extends Model
{
    protected $fillable = ['user_id'];

    public function upvotable()
    {
        return $this->morphTo();
    }
}
