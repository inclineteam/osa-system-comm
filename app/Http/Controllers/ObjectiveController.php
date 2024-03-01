<?php

namespace App\Http\Controllers;

use App\Models\Objective;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ObjectiveController extends Controller
{
    // index
    public function index()
    {
        return Inertia::render('Admin/Objectives');
    }

    // edit
    public function edit($id)
    {
        $objective = Objective::find($id);
        return Inertia::render('Admin/EditObjective', ['objective' => $objective]);
    }

    // create
    public function create()
    {
        return Inertia::render('Admin/CreateObjective');
    }

    // storeObjective
    public function storeObjective(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'objective_type' => 'required',
        ]);


        $objective = new Objective();

        // check first is submission_bin_id is not null
        if ($request->submission_bin_id != null) {

            $objective->title = $request->title;
            $objective->is_completed = 0;
            $objective->objective_type = $request->objective_type;
            $objective->submission_bin_id = $request->submission_bin_id;
            $objective->save();
        } else {


            $objective->title = $request->title;
            $objective->is_completed = 0;
            $objective->objective_type = $request->objective_type;
            $objective->submission_bin_id = null;
            $objective->save();
        }

        return redirect()->route('admin.objectives');
    }

    // all
    public function all()
    {
        $objectives = Objective::all();
        return response()->json($objectives);
    }

    // update
    public function update(Request $request)
    {

        try {
            $objective = Objective::find($request->id);
            $objective->update($request->all());
            $objective->save();
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error updating objective' . $th->getMessage()], 500);
        }

        return redirect()->route('admin.objectives');
    }

    // delete
    public function delete($id)
    {
        try {
            $objective = Objective::find($id);
            $objective->delete();
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error deleting objective'], 500);
        }

        return response()->json(['message' => 'Objective deleted successfully'], 200);
    }
}
