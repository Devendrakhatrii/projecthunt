<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'tech_stack' => $this->faker->randomElement(['Laravel, Vue.js', 'Laravel, React', 'Laravel, Docker']),
            'description' => $this->faker->paragraph(),
            'repo_url' => $this->faker->optional()->url(),
            'live_url' => $this->faker->optional()->url(),
            'status' => $this->faker->boolean(),
            'project_type' => $this->faker->randomElement(['personal', 'client', 'open-source']),
        ];
    }
}
