<?php

namespace App\Http\Controllers;

use App\Models\AnnualReport;
use App\Models\Campus;
use App\Models\User;
use App\Models\UserEventsHistory;
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
            $data = [];
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
                    // $data[$campus->name]["quarters"][$quarter] = [
                    //     'total' => 0,
                    //     'offices' => []
                    // ];

                    if (isset($data[$campus->name]["quarters"][$quarter]['total'])) {
                        $data[$campus->name]["quarters"][$quarter]['total'] += $report->reports->count();
                    } else {
                        $data[$campus->name]["quarters"][$quarter]['total'] = $report->reports->count();
                    }

                    // overall total
                    $data[$campus->name]['total'] += $report->reports->count();

                    // check if report has a designation
                    if ($report->designation) {
                        // check if isset
                        if (isset($data[$campus->name]["quarters"][$quarter]['offices'])) {
                            $data[$campus->name]["quarters"][$quarter]['offices'][$report->designation->name] =
                                ($data[$campus->name]["quarters"][$quarter]['offices'][$report->designation->name] ?? 0) +
                                $report->reports->count();
                        } else {
                            $data[$campus->name]["quarters"][$quarter]['offices'] = [];
                            $data[$campus->name]["quarters"][$quarter]['offices'][$report->designation->name] =
                                ($data[$campus->name]["quarters"][$quarter]['offices'][$report->designation->name] ?? 0) +
                                $report->reports->count();
                        }
                    }
                }
            }

            // get current logged in user

            $annualReport = AnnualReport::create([
                'generated_by' => $user->firstname . ' ' . $user->lastname,
                'generated_at' => now(),
                'data' => json_encode($data),
            ]);

            UserEventsHistory::create([
                'user_name' => $user->name(),
                'event_name' => 'Generate Annual Report',
                'campus_name' => $user->campus?->name,
                'office_name' => $user->designation?->name,
                'description' => 'Generated annual report for year ' . $year . '.',
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

            return response()->json(['reports' => $reports]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Reports not found!']);
        }
    }

    // delete report
    public function deleteAnnualReport(Request $request, $id)
    {
        try {

            $report = AnnualReport::find($id);
            $report->delete();

            UserEventsHistory::create([
                'user_name' => $request->user()->name(),
                'event_name' => 'Delete Annual Report',
                'campus_name' => $request->user()->campus?->name,
                'office_name' => $request->user()->designation?->name,
                'description' => 'Deleted annual report for year ' . $report->data->year . '.',
            ]);

            return response()->json(['message' => 'Report deleted successfully!']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Report not found!']);
        }
    }
}
