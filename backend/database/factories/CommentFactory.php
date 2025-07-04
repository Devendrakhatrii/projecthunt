<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'body' => $this->faker->sentence(),
            'commentable_id' => 1, // You can adjust this in the seeder
            'commentable_type' => 'App\Models\Story', // Or 'App\Models\Project'
            'user_id' => User::factory(),
            'parent_id' => null,
        ];
    }
}
