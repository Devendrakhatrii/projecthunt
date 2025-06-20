<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\ProjectNotification;
use App\Events\StoryCreated;

class SendStoryNotification
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
    public function handle(StoryCreated $event): void
    {
        $story = $event->story;
        $user = $story->user;

        foreach ($user->followers as $follower) {
            $follower->notifications()->create([
                'user_id' => $follower->id,
                'message' => "{$user->name} created a new project: {$story->title}",
                'slug' => $story->slug,
            ]);
        }
    }
}
