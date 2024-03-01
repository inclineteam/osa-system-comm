<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Objective extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'is_completed', // 0 - not completed, 1 - completed
        'objective_type', // 0 - manual, 1 - submission || , 2 - fixed # will not be accessible
        'submission_bin_id',
    ];
}
