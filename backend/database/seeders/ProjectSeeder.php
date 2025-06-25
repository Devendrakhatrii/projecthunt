<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure at least one user exists
        $user = User::first() ?? User::factory()->create();

        // Create 10 projects for the first user
        Project::factory()
            ->count(10)
            ->for($user)
            ->create();
    }
}
