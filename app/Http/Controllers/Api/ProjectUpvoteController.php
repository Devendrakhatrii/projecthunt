<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectUpvoteController extends Controller
{
    public function upvote(string $id)
    {
        try {
            $count = Project::find('user_id', Auth::id());
            if ($count) {
                $count->decrement('count');
            }
            $count->increment('count');
            return $this->success([], 'upvoted');
        } catch (Exception $e) {
            logger()->error(['error' => $e]);
            return $this->failure("couldn't upvote");
        }
    }
}
