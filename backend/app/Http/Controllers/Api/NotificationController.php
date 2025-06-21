<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\LogResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    use LogResponse;

    public function index(): JsonResponse
    {
        try {
            $notifications = Auth::user()
                ->notifications()
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return $this->success([
                'notifications' => $notifications->items(),
                'unread_count' => Auth::user()->notifications()->whereNull('read_at')->count(),
                'total' => $notifications->total(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ], 'Notifications retrieved successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch notifications', $e, 'notification.index');
            return $this->failure('Failed to fetch notifications');
        }
    }

    public function markAsRead(string $id): JsonResponse
    {
        try {
            $notification = Notification::where('user_id', Auth::id())
                ->findOrFail($id);

            $notification->update(['read_at' => now()]);

            return $this->success(
                ['unread_count' => Auth::user()->unreadNotifications()->count()],
                'Notification marked as read'
            );
        } catch (\Exception $e) {
            $this->logError('Failed to mark notification as read', $e, 'notification.markAsRead');
            return $this->failure('Failed to mark notification as read');
        }
    }
}
