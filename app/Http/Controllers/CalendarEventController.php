<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use App\Models\UserEventsHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarEventController extends Controller
{
    public function index(Request $request)
    {
        $data['events'] = CalendarEvent::all();
        if ($request->expectsJson()) {
            return response()->json($data);
        }
        return Inertia::render('Admin/Calendar', $data);
    }

    public function store(Request $request)
    {
        $newEvent = new CalendarEvent([
            'title' => $request->title,
            'start' => $request->start,
            'end' => $request->end,
            'user_id' => $request->user_id,
        ]);

        $newEvent->save();

        if ($request->expectsJson()) {
            return response()->json(['event' => $newEvent]);
        }

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Calendar Event',
            'campus_name' => $request->user()->campus->name,
            'office_name' => $request->user()->designation->name,
            'description' => 'Created calendar event with title: ' . $request->title
        ]);

        return redirect()->back()->with('success', 'Successfully created!');
    }

    public function destroy(Request $request)
    {
        $event = CalendarEvent::find($request->id);

        $event->delete();

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Delete Calendar Event',
            'campus_name' => $request->user()->campus->name,
            'office_name' => $request->user()->designation->name,
            'description' => 'Deleted calendar event with title: ' . $event->title
        ]);

        return response()->json(['success' => true]);
    }
}
