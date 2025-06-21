<?php

namespace App\Http\Controllers\Api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $users = User::with('projects')->get();
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
}
