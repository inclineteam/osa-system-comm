<?php

namespace App\Http\Controllers;

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
            if($request->has('access_token')){
                $user->google_access_token = $request->access_token;
            }
            if(!$user->image) {
                $user->image = $request->image;
            }
            $user->save();

            // Auth::guard('api')->login($user, true);
            Auth::login($user, true);
            return redirect()->intended(route('admin.dashboard'))->with('success','You successfully signed in!');
        }
    }

    public function profile(){
        return Inertia::render('Profile');
    }
}
