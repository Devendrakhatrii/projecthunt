<?php

namespace App\Http\Controllers\Api;

use App\Models\Bookmark;
use App\Models\BookmarkItem;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class BookmarkController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->validate([
                'title' => 'string|nullable|unique:bookmarks,title',
                'bookmark_id' => 'sometimes|nullable|integer|exists:bookmarks,id',
                'project_id' => 'required|integer|exists:projects,id'
            ]);


            if (!empty($data['bookmark_id'])) {
                $bookmark = Bookmark::where('id', $data['bookmark_id'])
                    ->where('user_id', Auth::id())
                    ->first();

                if (!$bookmark) {
                    DB::rollBack();
                    return $this->failure('Invalid bookmark id', [], 403);
                }
            } else {

                $bookmark = Bookmark::create([
                    'user_id' => Auth::id(),
                    'title' => $data['title']
                ]);
                // $data['bookmark_id'] = $bookmark->id;
            }




            // if the project is already added to this bookmark
            $alreadyExists = BookmarkItem::where('bookmark_id', $bookmark->id)
                ->where('project_id', $data['project_id'])
                ->exists();

            if ($alreadyExists) {
                DB::rollBack();
                return $this->failure('Project already added to this bookmark', [], 409);
            }


            $bookmarkCreated = BookmarkItem::create(['bookmark_id' => $bookmark->id, 'project_id' => $data['project_id']]);

            if ($bookmarkCreated) {
                DB::commit();
                return $this->success([], 'Bookmark Created');
            }
        } catch (ValidationException $e) {
            DB::rollBack();
            $this->logError('validation failed', $e, 'bookmark.store');
            return $this->failure('validation failed', $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Failed creating bookmark', $e, 'bookmark.store');
            return $this->failure(
                'Failed creating bookmark'
            );
        }
    }

    public function destroy(string $id)
    {
        try {
            $bookmark = BookmarkItem::where('bookmark_id', $id)->whereHas('bookmark', function ($query) {
                $query->where('user_id', Auth::id());
            })->first();

            if (!$bookmark) {
                return $this->success([], 'bookmark not found');
            }
            $deleted = $bookmark->delete();
            if ($deleted) {
                return $this->success([], 'Bookmark deleted');
            }
        } catch (\Exception $e) {
            $this->logError('Error deleting bookmark', $e, 'bookmark.store');
            return $this->failure(
                'Failed deleting bookmark'
            );
        }
    }

    public function index(): JsonResponse
    {
        try {
            $bookmarks = Auth::user()
                ->bookmarks()
                ->with(['bookmarkItems.project'])
                ->get();

            if ($bookmarks->isEmpty()) {
                return $this->success([], 'No bookmarks found');
            }

            return $this->success(
                $bookmarks,
                'Bookmarks retrieved successfully'
            );
        } catch (\Exception $e) {
            $this->logError('Failed fetching bookmark', $e, 'bookmark.index');

            return $this->failure(
                'Failed to fetch bookmarks',
            );
        }
    }
}
