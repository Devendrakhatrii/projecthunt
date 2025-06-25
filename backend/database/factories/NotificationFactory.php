<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => 'project',
            'message' => $this->faker->sentence(),
            'slug' => Str::slug($this->faker->unique()->words(3, true)),
            'read_at' => $this->faker->optional()->dateTime(),
        ];
    }
}
