<?php

namespace App\Http\Controllers\Api;

use App\Events\StoryCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStoryRequest;
use App\Http\Requests\UpdateStoryRequest;
use App\Models\Story;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class StoryController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $stories = Story::with('user')
                ->where('published', true)
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->success($stories, 'Stories fetched successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch stories', $e, 'story.index');
            return $this->failure('Failed to fetch stories');
        }
    }

    public function store(StoreStoryRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $story = Story::create([
                'user_id' => Auth::id(),
                ...$validated
            ]);

            if ($story) {
                //Notify all followers
                // foreach (Auth::user()->followers as $follower) {
                //     Notification::create([
                //         'user_id' => $follower->id,
                //         'message' => Auth::user()->name . ' created a new project: ' . $story->title,
                //         'slug' => $story->slug
                //     ]);
                // }

                StoryCreated::dispatch($story);
            }
            return $this->success($story, 'Story created successfully', 201);
        } catch (ValidationException $e) {
            $this->logError('validation failed', $e, 'story.show');
            return $this->failure('validation failed', $e->errors(), 422);
        } catch (\Exception $e) {
            $this->logError('Failed to create story', $e, 'story.store', $request);
            return $this->failure('Failed to create story');
        }
    }

    public function show(Story $story): JsonResponse
    {
        try {
            $story->load('user');

            // Increment views
            $story->increment('views');

            return $this->success($story, 'Story fetched successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch story', $e, 'story.show');
            return $this->failure('Story not found', null, 404);
        }
    }

    public function update(UpdateStoryRequest $request, Story $story): JsonResponse
    {
        try {
            // Only allow the owner to update
            if ($story->user_id !== Auth::id()) {
                return $this->failure('Unauthorized', null, 403);
            }

            $validated = $request->validated();
            $story->update($validated);

            return $this->success($story->fresh(), 'Story updated successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to update story', $e, 'story.update', $request);
            return $this->failure('Failed to update story');
        }
    }

    public function destroy(Story $story): JsonResponse
    {
        try {
            // Only allow the owner to delete
            if ($story->user_id !== Auth::id()) {
                return $this->failure('Unauthorized', null, 403);
            }

            $story->delete();

            return $this->success(null, 'Story deleted successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to delete story', $e, 'story.destroy');
            return $this->failure('Failed to delete story');
        }
    }
}
