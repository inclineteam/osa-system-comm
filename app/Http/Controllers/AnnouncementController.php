<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\UserEventsHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    //
    public function delete(Request $request)
    {
        $announcement = Announcement::where('id', $request->id)->firstOrFail();
        $announcement->delete();

        // create event history
        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Delete Announcement',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'Deleted announcement titled ' . "$announcement->title"
        ]);

        return response()->json(['message' => 'Successfully deleted!']);
    }

    public function create(Request $request)
    {
        // check if has announcements
        $count = Announcement::all(['id'])->count();
        $order = 0;

        if ($count > 0) {
            // get maximum order value
            $maxOrder = Announcement::all(['order'])->max(fn ($row) => $row->order);
            $order = $maxOrder + 1;
        }

        $announcement = Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
            'image' => $request->image,
            'order' => $order
        ]);

        // create event history
        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Create Announcement',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'Created announcement with title: ' . $request->title
        ]);

        return redirect()->intended(route('admin.announcements'))->with('success', "Successfully added new accouncement!");
    }

    public function edit(Request $request)
    {
        $announcement = Announcement::find($request->id);

        $announcement->title = $request->title;
        $announcement->content = $request->content;
        $announcement->image = $request->image;

        $announcement->save();

        // create event history
        UserEventsHistory::create([
            'user_name' => $request->user()->name(),
            'event_name' => 'Update Announcement',
            'campus_name' => $request->user()->campus?->name,
            'office_name' => $request->user()->designation?->name,
            'description' => 'Updated announcement with title: ' . $request->title
        ]);

        return redirect()->intended(route('admin.announcements'))->with('success', "Successfully updated accouncement!");
    }
    public function order(Request $request)
    {
        $id_1 = $request->get('item_1');
        $id_2 = $request->get('item_2');

        $row_1 = Announcement::find($id_1);
        $row_2 = Announcement::find($id_2);
        $temp_order = $row_1->order;
        $row_1->order = $row_2->order;
        $row_2->order = $temp_order;

        $row_1->save();
        $row_2->save();

        return response()->json(['success' => true, 'rows' => [$row_1, $row_2]]);
    }

    /* API */
    public function getAll(Request $request)
    {
        $data['announcements'] = Announcement::all();
        return response()->json($data);
    }
    /* API */
    public function dashboard(Request $request)
    {
        $data['announcements'] = Announcement::orderByDesc('order')->limit(2)->get();
        return response()->json($data);
    }
}
