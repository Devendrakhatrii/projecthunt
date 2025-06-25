<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\User;
use App\Models\Story;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create();
        $story = Story::first();

        if ($story) {
            // 10 comments on the first story
            Comment::factory()
                ->count(10)
                ->for($user)
                ->state([
                    'commentable_id' => $story->id,
                    'commentable_type' => Story::class,
                ])
                ->create();
        }
    }
}
