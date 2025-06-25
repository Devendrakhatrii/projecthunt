<?php

namespace App\Http\Controllers\Api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $users = User::with('projects')->get()->map(function ($user) {
                return $this->filterUser($user);
            });
            if ($users) {
                return $this->success($users, 'all users data');
            }
        } catch (\Exception $e) {
            Log::error('Failed getting users data', ['error' => $e]);
            return $this->failure(
                'failed getting users data'
            );
        }
    }

    public function showByUserName($user_name)
    {
        try {
            $authUser = Auth::user();

            $user = User::with(['projects', 'followers', 'following'])->where('user_name', $user_name)->first();

            if (!$user) {
                return $this->failure('User not found', 404);
            }
            // Check if logged-in user follows this user
            $isFollowed = false;
            if ($authUser && $authUser->id !== $user->id) {
                $isFollowed = $authUser->following()
                    ->where('user_id', $user->id)
                    ->exists();
            }

            $userData = $this->filterUser($user);
            $userData['is_followed'] = $isFollowed;

            return $this->success($userData, 'user data');
        } catch (\Exception $e) {
            $this->logError('Failed getting user by user_name', $e, []);
            return $this->failure('failed getting user data');
        }
    }


    // Helper to filter unwanted fields
    private function filterUser($user)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'user_name' => $user->user_name,
            'role' => $user->role,
            'bio' => $user->bio,
            'picture' => $user->picture,
            'created_at' => $user->created_at,
            'projects' => $user->projects,
            'followers' => $user->followers->map(function ($follower) {
                return [
                    'id' => $follower->id,
                    'name' => $follower->name,
                    'user_name' => $follower->user_name,
                    'picture' => $follower->picture,
                ];
            }),
            'following' => $user->following->map(function ($following) {
                return [
                    'id' => $following->id,
                    'name' => $following->name,
                    'user_name' => $following->user_name,
                    'picture' => $following->picture,
                ];
            }),
            'followers_count' => $user->followers->count(),
            'following_count' => $user->following->count(),
        ];
    }
}
