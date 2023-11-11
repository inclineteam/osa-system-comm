<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    //

    public function create(Request $request)
    {
        $reminder = Reminder::create([
            'title' => $request->title,
            'content' => $request->content
        ]);

        return redirect()->intended(route('admin.reminders'))->with('success', 'Successfully added reminder!');
    }

    public function edit(Request $request)
    {
        $reminder = Reminder::where('id', $request->id)->firstOrFail();

        $reminder->title = $request->title;
        $reminder->content = $request->content;
        $reminder->save();
        return redirect()->intended(route('admin.reminders'))->with('success', 'Successfully updated reminder!');
    }

    public function delete(Request $request)
    {
        $reminder = Reminder::where('id', $request->id)->firstOrFail();
        $reminder->delete();

        return response()->json(['message'=>'Successfully deleted!']);
    }

    /* API */
    public function all(Request $request){
        $data['reminders'] = Reminder::all();
        return response()->json($data);
    }
}
