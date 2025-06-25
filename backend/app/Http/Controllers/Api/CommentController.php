<?php

namespace App\Http\Controllers\Api;

use App\ApiResponse;
use App\LogResponse;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Story;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class CommentController extends Controller
{
    use ApiResponse, LogResponse;

    // Create a comment or reply
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:project,story',
                'id' => 'required|integer',
                'body' => 'required|string',
                'parent_id' => 'nullable|exists:comments,id',
            ]);

            $model = match ($validated['type']) {
                'project' => Project::class,
                'story' => Story::class,
            };

            $item = $model::findOrFail($validated['id']);

            $comment = $item->comments()->create([
                'body' => $validated['body'],
                'user_id' => Auth::id(),
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            return $this->success(
                $comment->load('user'),
                'Comment posted successfully'
            );
        } catch (ValidationException $e) {
            $this->logError('Validation failed for comment', $e, 'comment.store', $request);
            return $this->failure('Validation failed', $e->errors(), 422);
        } catch (ModelNotFoundException $e) {
            $this->logError('Target not found for comment', $e, 'comment.store', $request);
            return $this->failure('Target not found', null, 404);
        } catch (\Exception $e) {
            $this->logError('Failed to post comment', $e, 'comment.store', $request);
            return $this->failure('Failed to post comment', null, 500);
        }
    }

    // Fetch top-level comments and nested replies for a given model
    public function index(Request $request, string $type, int $id)
    {
        try {
            $model = match ($type) {
                'project' => Project::class,
                'story' => Story::class,
                default => abort(400, 'Invalid type'),
            };

            $item = $model::findOrFail($id);

            $comments = $item->comments()->with('replies.user')->get();

            return $this->success($comments, 'Comments fetched successfully');
        } catch (ModelNotFoundException $e) {
            $this->logError('Target not found for comments', $e, 'comment.index', $request);
            return $this->failure('Target not found', null, 404);
        } catch (\Exception $e) {
            $this->logError('Failed to fetch comments', $e, 'comment.index', $request);
            return $this->failure('Failed to fetch comments', null, 500);
        }
    }

    // Load replies for a specific comment (lazy load)
    public function loadReplies(Comment $comment)
    {
        try {
            $replies = $comment->replies()->with('user')->get();

            return $this->success($replies, 'Replies fetched successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch replies', $e, 'comment.loadReplies');
            return $this->failure('Failed to fetch replies', null, 500);
        }
    }
}
