<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CampusAdminController extends Controller
{
    //

    public function create(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'campus_id' => 'required',
        ]);

        $campus_admin = User::create([
            'email' => $request->email,
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'campus_id' => $request->campus_id,
        ]);

        $campus_admin->addRole('admin');

        return redirect()->intended(route('admin.admins'))->with('success', 'Successfully added!');
    }

    public function edit(Request $request)
    {
        $id = $request->user()->id;
        $request->validate([
            'email' => ['required','string',Rule::unique('users','email')->ignore($request->id)],
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'campus_id' => 'required',
        ]);

        $campus_admin = User::find($request->id);

        $campus_admin->email = $request->email;
        $campus_admin->firstname = $request->firstname;
        $campus_admin->lastname = $request->lastname;
        $campus_admin->middlename = $request->middlename;
        $campus_admin->campus_id = $request->campus_id;

        $campus_admin->save();

        return redirect()->intended(route('admin.admins'))->with('success', 'Successfully saved changes!');
    }
}
