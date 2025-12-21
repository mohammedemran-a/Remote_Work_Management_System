<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(auth()->user()->notifications);
    }

    public function unread()
    {
        return response()->json(auth()->user()->unreadNotifications);
    }

    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'تم تعليم الإشعار كمقروء']);
    }

    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'تم تعليم جميع الإشعارات كمقروءة']);
    }

    public function destroy($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'تم حذف الإشعار']);
    }

    public function clearAll()
    {
        auth()->user()->notifications()->delete();
        return response()->json(['message' => 'تم حذف جميع الإشعارات']);
    }
}
