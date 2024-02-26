<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UsersController extends Controller
{
    /* API */
    public function check(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        $success = false;
        if ($user && $user->hasRole($request->get('type'))) {
            $success = true;
        }

        return response()->json(['success' => $success]);
    }

    /* Web - auth */
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->whereHasRole($request->type)->first();

        if (!$user) {
            return redirect()->back()->with('error', 'Sorry that google account is not registered on our system.');
        } else {
            if ($request->has('access_token')) {
                $user->google_access_token = $request->access_token;
            }
            if (!$user->image) {
                $user->image = $request->image;
            }
            $user->save();


            // Auth::guard('api')->login($user, true);
            Auth::login($user, true);
            return redirect()->intended(route('admin.dashboard'))->with('success', 'You successfully signed in!');
        }
    }

    public function profile()
    {
        return Inertia::render('Profile');
    }

    // new users count
    public function newUsersCount()
    {
        $newUsersCount = User::whereDate('created_at', now())->count();

        return response()->json(['newUsersCount' => $newUsersCount]);
    }

    // left users count
    public function leftUsersCount()
    {
        $leftUsersCount = User::where('is_deleted', true)->count();
        return response()->json(['leftUsersCount' => $leftUsersCount]);
    }

    // total users count
    public function totalUsersCount()
    {
        $totalUsersCount = User::where('is_deleted', false)->count();
        return response()->json(['totalUsersCount' => $totalUsersCount]);
    }

    // submitted users count
    public function submittedUsersCount()
    {
        $submittedUsersCount = Report::where('is_submitted', true)->count();
        return response()->json(['submittedUsersCount' => $submittedUsersCount]);
    }

    // due users count
    public function dueUsersCount()
    {
        // Submission Bin <- Report <- User
        // Report has the following columns: user_id, submission_bin_id, status, is_archived, is_submitted
        // Submission Bin has the following columns:  'status', 'title', 'instruction', 'deadline_date', 'deadline_time', 'has_deadline'
        // check for users where due date is 3 days from now and is not submitted
        $dueUsersCount = Report::where('is_submitted', false)
            ->whereHas('submission_bin', function ($query) {
                $query->where('deadline_date', '>', now()->format('Y-m-d'))
                    ->where('deadline_date', '<', now()->addDays(7)->format('Y-m-d'));
            })->count();
        return response()->json(['dueUsersCount' => $dueUsersCount]);
    }

    // overdue users count
    public function overdueUsersCount()
    {
        // Submission Bin <- Report <- User
        // Report has the following columns: user_id, submission_bin_id, status, is_archived, is_submitted
        // Submission Bin has the following columns:  'status', 'title', 'instruction', 'deadline_date', 'deadline_time', 'has_deadline'
        // check for users where they have not submitted and the due date has passed
        $overdueUsersCount = Report::where('is_submitted', false)
            ->whereHas('submission_bin', function ($query) {
                $query->where('deadline_date', '<', now()->format('Y-m-d'));
            })->count();
        return response()->json(['overdueUsersCount' => $overdueUsersCount]);
    }
}
