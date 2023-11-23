<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\CalendarEvent;
use App\Models\Report;
use App\Models\SubmissionBin;
use App\Models\User;
use App\Models\UserEventsHistory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UnitHeadController extends Controller
{
    //
    public function create(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email|regex:/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/',
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'campus_id' => 'required',
            'designation_id' => 'required',
        ], [
            'email.regex' => 'This email is not a google account.'
        ]);

        $user = User::create([
            'email' => $request->email,
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'campus_id' => $request->campus_id,
            'designation_id' => $request->designation_id,
        ]);

        $user->addRole('unit_head');

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Unit Head',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'created unit head ' . $user->name()
        ]);

        return redirect()->intended(route("admin.unit_heads.records"))->with('success', 'Successfully added!');
    }

    public function edit(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'regex:/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/', Rule::unique('users', 'email')->ignore($request->id)],
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'campus_id' => 'required',
        ], [
            'email.regex' => 'This email is not a google account.'
        ]);

        $unitHead = User::find($request->id);

        $unitHead->email = $request->email;
        $unitHead->firstname = $request->firstname;
        $unitHead->lastname = $request->lastname;
        $unitHead->middlename = $request->middlename;
        $unitHead->campus_id = $request->campus_id;
        $unitHead->designation_id = $request->designation_id;

        $unitHead->save();

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Edit Unit Head',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'edited unit head ' . $unitHead->name()
        ]);

        return redirect()->intended(route('admin.unit_heads.records'))->with('success', 'Successfully saved changes!');
    }

    /* reports page*/
    public function reports(Request $request)
    {
        $data['submissionBins'] = SubmissionBin::limit(5)->orderByDesc('id')->get();
        $data['rows'] = count(SubmissionBin::all());
        $data['reports'] = $request->user()->reports()->get();
        return Inertia::render('UnitHead/UnitHeadReports', $data);
    }

    public function submission_bin(Request $request, $id)
    {
        $submissionBin = SubmissionBin::where('id', $id)->firstOrFail();
        $data['submissionBin'] = $submissionBin;
        $data['report'] = Report::with(['attachments'])->where('submission_bin_id', $submissionBin->id)->where('user_id', $request->user()->id)->first();

        return Inertia::render('UnitHead/SubmissionBin', $data);
    }

    public function announcements()
    {
        $data['announcements'] = Announcement::all();
        return Inertia::render('UnitHead/Announcements', $data);
    }
    public function deleteMany(Request $request)
    {
        $ids = $request->id;

        foreach ($ids as $key => $id) {
            $unitHead = User::find($id);
            $unitHead->delete();
        }

        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Delete Unit Heads',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'deleted unit head/s'
        ]);

        return response()->json(['success' => true]);
    }
    public function calendar(Request $request)
    {
        $data['events'] = CalendarEvent::all();
        if ($request->expectsJson()) {
            return response()->json($data);
        }
        return Inertia::render('UnitHead/Calendar', $data);
    }
}
