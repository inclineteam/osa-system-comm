<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    //

    public function create(Request $request){
        $feedback = Feedback::create([
            'reaction' => $request->reaction,
            'type' => $request->type,
            'comment' => $request->comment,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('success','Successfully submitted your feedback, Thank you for giving your time!');
    }
}
