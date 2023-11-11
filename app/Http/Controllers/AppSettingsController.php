<?php

namespace App\Http\Controllers;

use App\Models\AppSettings;
use Illuminate\Http\Request;

class AppSettingsController extends Controller
{
    //
    public function update(Request $request, AppSettings $appSettings){
        $appSettings->logo = $request->logo;
        $appSettings->policy = $request->policy;
        $appSettings->save();

        return redirect()->back()->with('success','Successfully updated settings!');
    }

    public function getPolicy(){
        $appSettings = AppSettings::first();
        return response()->json(['policy' => $appSettings->policy]);
    }
}
