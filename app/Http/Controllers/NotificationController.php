<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use App\Models\User;
use App\Notifications\CalendarEventNotification;
use App\Notifications\NewCalendarEvent;
use App\Notifications\NewReportApproved;
use App\Notifications\NewReportSubmitted;
use App\Notifications\NewSubmissionBin;
use App\Notifications\ReportStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notification;

class NotificationController extends Controller
{
    //
    public function get(Request $request)
    {
        $user = User::find($request->id);
        if (!$user) {
            $data['notifications'] = [];
            $data['error'] = "User not found!";
        } else {
            $data['notifications'] = $user->unreadNotifications()->get();
        }
        return response()->json($data);
    }
    //
    public function general(User $user)
    {
        if (!$user) {
            $data['notifications'] = [];
            $data['error'] = "User not found!";
        } else {
            if ($user->hasRole('super_admin')) {
                $data['notifications'] = $user->unreadNotifications()
                    ->whereIn('type', [
                        NewReportApproved::class,
                    ])
                    ->get();
            } else if ($user->hasRole('admin')) {
                $data['notifications'] = $user->unreadNotifications()->where('type', NewReportSubmitted::class)->get();
            } else {
                // for unit heads
                $data['notifications'] = $user->unreadNotifications()
                    ->whereIn('type', [
                        NewSubmissionBin::class,
                        ReportStatusUpdated::class
                    ])
                    ->get();
            }
        }
        return response()->json($data);
    }

    public function calendar(User $user)
    {
        // $user = User::find($request->id);
        if (!$user) {
            $data['notifications'] = [];
            $data['error'] = "User not found!";
        } else {
            $data['notifications'] = $user->unreadNotifications()
                ->whereIn('type', [
                    NewCalendarEvent::class,
                    CalendarEventController::class
                ])
                ->get();
        }
        return response()->json($data);
    }

    public function open(Request $request)
    {
        $notification = $request->user()->Notifications()->find($request->id);
        if (!$notification) {
            return response(['message' => 'Not found', 'notification id: ' => $request->id], 404);
        }
        $notification->markAsRead();
        return redirect()->intended($notification->data['link']);
    }

    public function markAsRead(User $user)
    {
        $notifications = $user->Notifications()->get();
        foreach ($notifications as $notification) {
            $notification->markAsRead();
        }

        return response()->json(['success' => true, 'user' => $user, 'notifications' => $notifications]);
    }

    public function markAsReadCalendar(User $user)
    {
        $notifications = $user->Notifications()
            ->whereIn('type', [
                CalendarEventNotification::class
            ])
            ->get();
        foreach ($notifications as $notification) {
            $notification->markAsRead();
        }

        return response()->json(['success' => true, 'user' => $user, 'notifications' => $notifications]);
    }
}
