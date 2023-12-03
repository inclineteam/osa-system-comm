<?php

namespace App\Http\Controllers;

use App\Models\AnnualReport;
use App\Models\Campus;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnualReportController extends Controller
{
    public function index($id)
    {
        $report = AnnualReport::find($id);

        $report->data = json_decode($report->data);

        // convert data to array
        $report->data = (array) $report->data;

        return Inertia::render(
            'Admin/SpecificAnnualReport',
            [
                'report' => $report,
            ]
        );
    }

    public function generateReport(Request $request)
    {
        try {
            // get report data

            $year = $request['data']['year'];
            $user = User::find($request['data']['user']);

            $campuses = Campus::all();

            foreach ($campuses as $campus) {

                $data[$campus->name] = [
                    'total' => 0,
                    'quarters' => []
                ];

                $reports = User::where('campus_id', $campus->id)->get();

                foreach ($reports as $report) {
                    // format $report->created_at to year
                    $reportYear = $report->created_at->format('Y');

                    // check if $reportYear is equal to $year
                    if ($reportYear != $year) {
                        continue;
                    }

                    // calculate quarter
                    $quarter = ceil($report->created_at->format('m') / 3);

                    // initialize $data array
                    $data[$campus->name]["quarters"][$quarter] = [
                        'total' => 0,
                        'offices' => []
                    ];

                    $data[$campus->name]["quarters"][$quarter]['total'] += $report->reports->count();

                    // overall total
                    $data[$campus->name]['total'] += $report->reports->count();

                    // check if report has a designation
                    if ($report->designation) {
                        // check if isset
                        $data[$campus->name]["quarters"][$quarter]['offices'][$report->designation->name] =
                            ($data[$campus->name]["quarters"][$quarter]['offices'][$report->designation->name] ?? 0) +
                            $report->reports->count();
                    }
                }
            }

            // get current logged in user

            $annualReport = AnnualReport::create([
                'generated_by' => $user->id,
                'generated_at' => now(),
                'data' => json_encode($data),
            ]);

            return response()->json(['message' => 'Report generated successfully!']);
        } catch (\Throwable $th) {
            dd($th);
        }
    }



    // get all reports
    public function getAllAnnualReports()
    {
        try {
            $reports = AnnualReport::all();

            foreach ($reports as $report) {
                $report->generated_by = $report->generatedBy;
                $report->data = json_decode($report->data);
            }

            return response()->json(['reports' => $reports]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Reports not found!']);
        }
    }

    // // get report
    // public function getAnnualReport($id)
    // {
    //     try {
    //         $report = AnnualReport::find($id);

    //         return response()->json(['report' => $report]);
    //     } catch (\Throwable $th) {
    //         return response()->json(['message' => 'Report not found!']);
    //     }
    // }

    // delete report
    public function deleteAnnualReport($id)
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
