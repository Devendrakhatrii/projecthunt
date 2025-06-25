<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\LogResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Events\FollowNotification;

class FollowController extends Controller
{
    use LogResponse;

    public function follow(User $user): JsonResponse
    {
        try {
            $follower = Auth::user();

            if ($follower->id === $user->id) {
                return $this->failure('cannot follow oneself');
            }

            $follower->following()->syncWithoutDetaching([$user->id]);

            event(new FollowNotification($follower, $user));

            return $this->success(
                ['following_count' => $follower->following()->count()],
                'Followed successfully'
            );
        } catch (\Exception $e) {
            $this->logError('Follow failed', $e, 'follow.create');
            return $this->failure('Failed to follow user');
        }
    }

    public function unfollow(User $user): JsonResponse
    {
        try {
            $follower = Auth::user();
            $follower->following()->detach($user->id);

            return $this->success(
                ['following_count' => $follower->following()->count()],
                'Unfollowed successfully'
            );
        } catch (\Exception $e) {
            $this->logError('Unfollow failed', $e, 'follow.delete');
            return $this->failure('Failed to unfollow user');
        }
    }

    public function myFollowers(): JsonResponse
    {
        try {
            $followers = Auth::user()->followers()
                ->with('profile')
                ->paginate(20);

            return $this->success($followers, 'Followers retrieved successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch followers', $e, 'follow.followers');
            return $this->failure('Failed to fetch followers');
        }
    }

    public function myFollowing(): JsonResponse
    {
        try {
            $following = Auth::user()->following()
                ->with('profile')
                ->paginate(20);

            return $this->success($following, 'Following retrieved successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch following', $e, 'follow.following');
            return $this->failure('Failed to fetch following');
        }
    }
}
