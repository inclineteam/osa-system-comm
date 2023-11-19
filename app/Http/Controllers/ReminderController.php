<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use App\Models\UserEventsHistory;
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

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Reminder',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'Created reminder with title: ' . $request->title
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

        return response()->json(['message' => 'Successfully deleted!']);
    }

    /* API */
    public function all(Request $request)
    {
        $data['reminders'] = Reminder::all();
        return response()->json($data);
    }
}
