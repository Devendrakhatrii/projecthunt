<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Story;
use App\Models\Upvote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpvoteController extends Controller
{

    public function toggleUpvote(Request $request)
    {
        try {
            $userId = Auth::id();
            $type = $request->input('type');
            $id = $request->input('id');

            $model = match ($type) {
                'project' => Project::class,
                'story' => Story::class,
                default => null,
            };

            if (!$model) {
                return $this->failure('Invalid type');
            }

            $item = $model::findOrFail($id);

            $existing = Upvote::where([
                'user_id' => $userId,
                'upvotable_id' => $item->id,
                'upvotable_type' => $model,
            ])->first();

            if ($existing) {
                $existing->delete();
                return $this->success(null, 'Upvote removed');
            } else {
                $item->upvotes()->create([
                    'user_id' => $userId,
                ]);
                return $this->success(null, 'Upvoted');
            }
        } catch (\Exception $e) {
            $this->logError('Failed to toggle upvote', $e, 'upvote.toggle', $request);
            return $this->failure('Failed to toggle upvote');
        }
    }

    public function upvotes(Request $request, string $type, string $id)
    {
        try {
            $model = match ($type) {
                'project' => Project::class,
                'story' => Story::class,
                default => null,
            };

            if (!$model) {
                return $this->failure('Invalid type');
            }

            $item = $model::findOrFail($id);

            return $this->success([
                'count' => $item->upvotes()->count()
            ], 'Upvote count fetched');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch upvote count', $e, 'upvote.count');
            return $this->failure('Failed to fetch upvote count');
        }
    }
}
