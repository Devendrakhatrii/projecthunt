<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FollowNotification
{
    use Dispatchable, SerializesModels;


    /**
     * Create a new event instance.
     */
    public function __construct(public User $follower, public User $followed) {}
}
