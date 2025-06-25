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
        $titles = [
            'Open Source Task Manager',
            'Personal Portfolio Website',
            'E-commerce Platform',
            'Real-time Chat App',
            'Blog CMS',
            'Weather Dashboard',
            'Crypto Tracker',
            'Recipe Sharing Platform',
            'Fitness Tracker',
            'Online Code Editor',
        ];
        $techStacks = [
            'Laravel, React',
            'Next.js, Tailwind CSS',
            'Vue.js, Node.js',
            'Django, React',
            'Flask, Bootstrap',
            'Ruby on Rails, Vue.js',
            'Spring Boot, Angular',
            'Express.js, EJS',
            'ASP.NET, Blazor',
            'Svelte, Supabase',
        ];
        $liveUrls = [
            'https://demo.taskmanager.com',
            'https://portfolio.johndoe.com',
            'https://shopnow.live',
            'https://chatfast.app',
            'https://blogcms.dev',
            'https://weatherdash.io',
            'https://cryptotracker.app',
            'https://recipesphere.com',
            'https://fittrack.live',
            'https://codepad.dev',
        ];
        $repoUrls = [
            'https://github.com/demo/taskmanager',
            'https://github.com/johndoe/portfolio',
            'https://github.com/shopnow/ecommerce',
            'https://github.com/chatfast/app',
            'https://github.com/blogcms/core',
            'https://github.com/weatherdash/dashboard',
            'https://github.com/cryptotracker/app',
            'https://github.com/recipesphere/platform',
            'https://github.com/fittrack/tracker',
            'https://github.com/codepad/editor',
        ];

        $idx = $this->faker->numberBetween(0, 9);

        return [
            'user_id' => User::factory(),
            'title' => $titles[$idx],
            'tech_stack' => $techStacks[$idx],
            'description' => $this->faker->paragraph(),
            'repo_url' => $repoUrls[$idx],
            'live_url' => $liveUrls[$idx],
            'status' => 1,
            'project_type' => $this->faker->randomElement(['personal', 'client', 'open-source']),
        ];
    }
}
