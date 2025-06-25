<?php

namespace App;

trait HasTimeAgo
{
    public function getTimeAgoAttribute()
    {
        return $this->created_at->diffForHumans();
    }
}
