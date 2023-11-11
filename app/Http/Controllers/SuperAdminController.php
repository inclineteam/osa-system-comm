<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Reminder;
use App\Models\SuperAdmin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
   public function register(Request $request){
        $user = User::create([
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'phone' => $request->phone,
            'google_access_token'=>$request->access_token,
            'image'=>$request->image,
        ]);
        
        if($user){
            $user->addRole('super_admin');
            Auth::login($user,true);
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->back()->with('error','Error');
   }
}
