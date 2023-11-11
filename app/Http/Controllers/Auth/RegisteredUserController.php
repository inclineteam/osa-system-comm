<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\SuperAdmin;
use App\Models\UnitHead;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $model = $request->get('type') == 'super_admin'?SuperAdmin::class : ($request->get('type') == 'admin'? Admin::class : UnitHead::class);

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . $model,
            'phone' => 'required|string|max:255|unique:' . $model,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $userData = [
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ];
        
        $userType = $request->get('type');
        $home = '';
        switch ($userType) {
            case 'super_admin':
                $user = SuperAdmin::create($userData);
                $home=route('super-admin.index');
                break;
            case 'admin':
                $user = Admin::create($userData);
                break;
            case 'unit_head':
                $user = UnitHead::create($userData);
                break;
        }

        event(new Registered($user));

        Auth::guard($userType)->login($user);

        return redirect($home);
    }
}
