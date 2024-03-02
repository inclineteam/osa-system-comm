<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserObjective extends Model
{
    use HasFactory;

    // objective_id, is_completed, user_id
    protected $fillable = [
        'objective_id',
        'is_completed',
        'user_id',
        'is_archived'
    ];

    // objective
    public function objective()
    {
        return $this->belongsTo(Objective::class);
    }
}
