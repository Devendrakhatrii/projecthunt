<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\StoryController;
use App\Http\Controllers\Api\FollowController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UpvoteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');


Route::get('/home', function () {
    return response()->json("home");
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/signin', [AuthController::class, 'signin']);

Route::get('/users', [UserController::class, 'index']);


Route::middleware('auth:api')->group(function () {
    Route::apiResource('projects', ProjectController::class);

    Route::apiResource('bookmarks', BookmarkController::class)->only(['index', 'store', 'destroy']);

    Route::apiResource('stories', StoryController::class);

    Route::post('/follow/{user}', [FollowController::class, 'follow']);
    Route::delete('/unfollow/{user}', [FollowController::class, 'unfollow']);
    Route::get('/me/followers', [FollowController::class, 'myFollowers']);
    Route::get('/me/following', [FollowController::class, 'myFollowing']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    Route::post('/upvote', [UpvoteController::class, 'toggleUpvote']);
    Route::get('upvotes/{type}/{id}', [UpvoteController::class, 'upvotes']);
});
