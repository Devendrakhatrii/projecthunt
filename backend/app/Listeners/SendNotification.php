<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\ProjectNotification;
use Illuminate\Support\Facades\Auth;

class SendNotification
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
    public function handle(ProjectNotification $event): void
    {
        $project = $event->project;
        $user = $project->user;

        foreach ($user->followers as $follower) {
            $follower->notifications()->create([
                'user_id' => $follower->id,
                'from' => Auth::id(),
                'type' => 'project',
                'message' => "created a new project: {$project->title}",
                'slug' => $project->title,
            ]);
        }
    }
}
