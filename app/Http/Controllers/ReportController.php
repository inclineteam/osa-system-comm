<?php

namespace App\Http\Controllers;

use App\Models\Campus;
use App\Models\Designation;
use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\User;
use App\Models\UserEventsHistory;
use App\Notifications\NewReportSubmitted;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;

class ReportController extends Controller
{
    /* API */
    public function all(Request $request)
    {
        $campus_id = $request->campus_id;
        $submission_bin_id = $request->submission_bin_id;
        $unit_heads = User::select('id')->where('campus_id', $campus_id);
        $data['reports'] = Report::whereIn('user_id', $unit_heads)->where('submission_bin_id', $submission_bin_id)->where('user_id', $request->unit_head_id)->where('is_submitted', true)->get();

        return response()->json($data);
    }

    /* API */
    public function getApproved(Request $request)
    {
        $campus_id = $request->campus_id;
        $submission_bin_id = $request->submission_bin_id;
        $unit_heads = User::select('id')->where('campus_id', $campus_id);
        $data['reports'] = Report::whereIn('user_id', $unit_heads)->where('submission_bin_id', $submission_bin_id)->where('user_id', $request->unit_head_id)->where('is_submitted', true)->where('status', 'Approved')->get();

        return response()->json($data);
    }

    public function addReport(Request $request)
    {
        $bin_id = $request->submission_bin_id;
        $user = User::where('id', $request->user_id)->first();

        $report = Report::where('submission_bin_id', $bin_id)->where('user_id', $user->id)->first();
        // if no report created yet
        if (!$report) {
            // create report
            $report = Report::create([
                'user_id' => $user->id,
                'submission_bin_id' => $bin_id,
            ]);
        }
        // save report to server
        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $file->move(public_path('reports'), $fileName);
        $fileUrl = "/reports/" .  $fileName;

        // create report attachment
        $attachment = ReportAttachment::create([
            'uri' => $fileUrl,
            'name' => $fileName,
            'report_id' => $report->id
        ]);


        UserEventsHistory::create([
            'user_name' => $user->name(),
            'event_name' => 'Add Report',
            'campus_name' => $user->campus?->name,
            'office_name' => $user->designation?->name,
            'description' => 'added report with title ' . "$report->title"
        ]);

        return response()->json(['fileUrl' => $fileUrl, 'attachment' => $attachment]);
    }
    /* api */
    public function removeAttachment(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();
        $attachment_id = $request->id;
        $attachment = ReportAttachment::find($attachment_id);
        if ($attachment) {
            $attachment->delete();
        }

        UserEventsHistory::create([
            'user_name' => $user->name(),
            'event_name' => 'Remove Report Attachment',
            'campus_name' => $user->campus?->name,
            'office_name' => $user->designation?->name,
            'description' => 'removed report attachment with id ' . $attachment_id
        ]);

        return response()->json(['success' => true]);
    }

    public function submitReport(Request $request)
    {
        $user = $request->user();
        $report = Report::with(['submission_bin'])->where('submission_bin_id', $request->submission_bin_id)->where('user_id', $user->id)->first();

        if ($report) {
            $report->is_submitted = true;
            $report->status = 'Pending';
            $report->date_submitted = Carbon::now()->toDateTimeString();

            //check if has deadline
            if ($report->deadline_date) {
                if ($report->deadline_date > Carbon::now()->toDate()) {
                    $report->remarks = "Submitted late";
                } else {
                    $report->remarks = "Submitted on time";
                }
            } else {
                $report->remarks = "Submitted on time";
            }

            if ($report->save()) {
                $admin = User::whereHasRole('admin')->where('campus_id', $user->campus_id)->get();
                foreach ($admin as $key => $admin) {
                    $admin->notify(new NewReportSubmitted($report));
                }

                UserEventsHistory::create([
                    'user_name' => $request->user()->name(),
                    'event_name' => 'Submit Report',
                    'campus_name' => $request->user()->campus?->name,
                    'office_name' => $request->user()->designation?->name,
                    'description' => 'submitted report with title ' . "$report->title"
                ]);

                return redirect()->back()->with("success", 'Successfully submitted!');
            }
        }

        return redirect()->back()->with('error', 'Something went wrong please try again later!');
    }
    public function unSubmitReport(Request $request)
    {
        $user = $request->user();
        $report = Report::where('submission_bin_id', $request->submission_bin_id)->where('user_id', $user->id)->first();

        if ($report) {
            $report->is_submitted = false;
            if ($report->save()) {
                UserEventsHistory::create([
                    'user_name' => $request->user()->name(),
                    'event_name' => 'Unsubmit Report',
                    'campus_name' => $request->user()->campus?->name,
                    'office_name' => $request->user()->designation?->name,
                    'description' => 'unsubmitted report with title ' . $report->title
                ]);
                return redirect()->back();
            }
        }

        return redirect()->back()->with('error', 'Something went wrong please try again later!');
    }

    /* API */
    public function unit_heads(Request $request)
    {
        $unit_heads = User::where('campus_id', $request->campus_id)->where('designation_id', $request->designation_id)->whereHasRole(['unit_head'])->get();
        return response()->json(['unitHeads' => $unit_heads]);
    }

    public function unit_heads_designated(Request $request)
    {
        $unit_heads = User::where('campus_id', $request->campus_id)->whereHasRole(['unit_head'])->get();
        return response()->json(['unitHeads' => $unit_heads]);
    }

    public function unit_heads_campus(Request $request)
    {
        $unit_heads = User::where('campus_id', $request->campus_id)->whereHasRole(['unit_head'])->get();
        return response()->json(['unitHeads' => $unit_heads]);
    }

    public function view(Request $request, Report $report)
    {
        if ($request->user()->hasRole('unit_head')) {
            return redirect()->route('unit_head.submission_bin', ['id' => $report->submission_bin_id]);
        } else {
            return redirect()->route('admin.report.open', ['report_id' => $report->id]);
        }
    }

    public function latest(Request $request)
    {
        $latestReport = Report::latest('created_at')->first();
        return response()->json(['latestReport' => $latestReport]);
    }

    public function forReview(Request $request)
    {
        $reportsForReview = Report::where('status', 'Pending')->get();
        return Inertia::render('Admin/ForReviewReports', [
            'reportsForReview' => $reportsForReview
        ]);
    }

    public function forRequested(Request $request)
    {
        $reportsForRequested = Report::where('status', 'Approved')->get();
        return Inertia::render('Admin/ForRequestReports', [
            'reportsForRequested' => $reportsForRequested
        ]);
    }

    public function forRejected(Request $request)
    {
        $reportsForRejected = Report::where('status', 'Rejected')->get();
        return Inertia::render('Admin/ForRejectedReports', [
            'reportsForRejected' => $reportsForRejected
        ]);
    }

    public function getReportsPerCampus()
    {
        $reports = Report::all();
        $campus = Campus::all();
        return response()->json(['campuses' => $campus, 'reports' => $reports]);
    }

    // summary
    public function summary(Request $request)
    {
        $campus = Campus::all();

        foreach ($campus as $key => $campus) {
            $data[$campus->name] = [
                'total' => 0,
                'offices' => []
            ];

            $reports = User::where('campus_id', $campus->id);

            foreach ($reports as $key => $report) {
                $data[$campus->name]['total'] += $report->reports->count();
                $data[$campus->name]['offices'][$report->designation->name] = $report->reports->count();
            }
        }

        return response()->json(['data' => $data]);
    }
}
