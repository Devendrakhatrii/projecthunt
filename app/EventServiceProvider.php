<?php

use App\Events\ProjectNotification;
use App\Events\StoryCreated;
use App\Listeners\SendNotification;
use App\Listeners\SendStoryNotification;

class EventServiceProvider
{
    protected $listen = [
        ProjectNotification::class => [
            SendNotification::class,
        ],
        StoryCreated::class => [
            SendStoryNotification::class
        ]
    ];
}
