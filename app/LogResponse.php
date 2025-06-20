<?php

namespace App;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


trait LogResponse
{
    public function logError(string $message, $exception, $action, $request = null)
    {
        $context = [
            'action' => $action,
            'user_id' => Auth::id(),
            'exception' => [
                'message' => $exception->getMessage(),
                'code' => $exception->getCode(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString()
            ]
        ];

        if ($request) {
            $context['request_data'] = $request->except(['password']);
        }

        if (method_exists($exception, 'errors')) {
            $context['validation_errors'] = $exception->errors();
        }

        Log::error($message, $context);
    }
}
