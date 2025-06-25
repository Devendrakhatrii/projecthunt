<?php

use App\Events\FollowNotification;
use App\Events\ProjectNotification;
use App\Events\StoryCreated;
use App\Listeners\SendFollowNotification;
use App\Listeners\SendNotification;
use App\Listeners\SendStoryNotification;

class EventServiceProvider
{
    protected $listen = [
        ProjectNotification::class => [
            SendNotification::class,
        ],
        FollowNotification::class => [
            SendFollowNotification::class
        ],
        StoryCreated::class => [
            SendStoryNotification::class
        ]
    ];
}
