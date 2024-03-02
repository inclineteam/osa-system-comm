<?php

namespace App\Http\Controllers;

use App\Models\Objective;
use App\Models\User;
use App\Models\UserObjective;
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

            $objective->objective_type = $request->objective_type;
            $objective->submission_bin_id = $request->submission_bin_id;
            $objective->save();
        } else {


            $objective->title = $request->title;

            $objective->objective_type = $request->objective_type;
            $objective->submission_bin_id = null;
            $objective->save();
        }

        // all unitHeads where they have a designation of unit head and not null
        $unitHeads = User::whereNotNull('campus_id')->get();

        foreach ($unitHeads as $unitHead) {
            UserObjective::create([
                'objective_id' => $objective->id,
                'user_id' => $unitHead->id,
                'is_completed' => false,
                'is_archived' => false
            ]);
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

    // alluserobjectives
    public function allUserObjectives($id)
    {
        $userObjectives = UserObjective::where('user_id', $id)->get();

        foreach ($userObjectives as $userObjective) {
            $userObjective->objective;
        }
        return response()->json($userObjectives);
    }

    //update user objective
    public function updateUserObjective(Request $request)
    {
        try {
            $userObjective = UserObjective::find($request->id);
            $userObjective->update($request->all());
            $userObjective->save();
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Error updating user objective' . $th->getMessage()], 500);
        }

        return response()->json(['message' => 'User objective updated successfully'], 200);
    }
}
