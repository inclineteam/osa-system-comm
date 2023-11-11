<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportAttachment;
use App\Models\User;
use App\Notifications\NewReportSubmitted;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

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
        $user_id = $request->user_id;

        $report = Report::where('submission_bin_id', $bin_id)->where('user_id', $user_id)->first();
        // if no report created yet
        if (!$report) {
            // create report
            $report = Report::create([
                'user_id' => $user_id,
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

        return response()->json(['fileUrl' => $fileUrl, 'attachment' => $attachment]);
    }
    /* api */
    public function removeAttachment(Request $request)
    {
        $attachment_id = $request->id;
        $attachment = ReportAttachment::find($attachment_id);
        if ($attachment) {
            $attachment->delete();
        }

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
    /* API */
    public function unit_heads_designated(Request $request)
    {
        $unit_heads = User::where('campus_id', $request->campus_id)->whereHasRole(['unit_head'])->get();
        return response()->json(['unitHeads' => $unit_heads]);
    }
    /* API */
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
}
