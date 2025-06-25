<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FollowSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // pick random users to follow (excluding themselves)
            $toFollow = $users->where('id', '!=', $user->id)->random(rand(1, 5));

            foreach ($toFollow as $followee) {
                DB::table('followers')->updateOrInsert([
                    'user_id' => $followee->id,
                    'follower_id' => $user->id,
                ], [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
