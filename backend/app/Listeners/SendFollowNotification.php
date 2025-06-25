<?php

namespace App\Listeners;

use App\Events\FollowNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\ProjectNotification;
use Illuminate\Support\Facades\Auth;

class SendFollowNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(FollowNotification $event): void
    {
        // The followed user receives the notification
        $event->followed->notifications()->create([
            'user_id' => $event->followed->id,
            'from' => $event->follower->id,
            'slug' => "{$event->follower->name}-started-following-you.",
            'type' => 'follow',
            'message' => "started following you.",
        ]);
    }
}
