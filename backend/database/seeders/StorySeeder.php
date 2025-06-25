<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Story;
use App\Models\User;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure at least one user exists
        $user = User::first() ?? User::factory()->create();

        // Create 10 stories for the first user
        Story::factory()
            ->count(10)
            ->for($user)
            ->create();
    }
}
