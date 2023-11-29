<?php

namespace App\Http\Controllers;

use App\Models\AnnualReport;
use App\Models\Campus;
use App\Models\User;
use Illuminate\Http\Request;

class AnnualReportController extends Controller
{
    public function generateReport(Request $request)
    {
        // get report data

        $year = $request->year;

        $campuses = Campus::all();

        foreach ($campuses as $key => $campus) {
            $data[$campus->name] = [
                'total' => 0,
                'offices' => []
            ];

            $reports = User::where('campus_id', $campus->id)->get();

            foreach ($reports as $key => $report) {

                // format $report->created_at to year
                $reportYear = $report->created_at->format('Y');

                // check if $reportYear is equal to $year
                if ($reportYear != $year) {
                    continue;
                }

                // check if $report status is approved
                if ($report->status == 'approved') {
                    $data[$campus->name]['total'] += $report->reports->count();

                    // check if report has a designation
                    if ($report->designation) {
                        // check if isset
                        if (isset($data[$campus->name]['offices'][$report->designation->name])) {
                            $data[$campus->name]['offices'][$report->designation->name] += $report->reports->count();
                        } else {
                            $data[$campus->name]['offices'][$report->designation->name] = $report->reports->count();
                        }
                    }
                }
            }
        }

        // get current logged in user
        $user = auth()->user();

        AnnualReport::create([
            'generated_by' => $user->id,
            'generated_at' => now(),
            'data' => json_encode($data),
        ]);

        return response()->json(['message' => 'Report generated successfully!']);
    }

    // get all reports
    public function getAllAnnualReports()
    {
        try {
            $reports = AnnualReport::all();

            return response()->json(['reports' => $reports]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Reports not found!']);
        }
    }

    // get report
    public function getAnnualReport($id)
    {
        try {
            $report = AnnualReport::find($id);

            return response()->json(['report' => $report]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Report not found!']);
        }
    }

    // delete report
    public function delete($id)
    {
        try {
            $report = AnnualReport::find($id);

            $report->delete();

            return response()->json(['message' => 'Report deleted successfully!']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Report not found!']);
        }
    }
}
