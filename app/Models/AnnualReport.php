<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnualReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'generated_by',
        'generated_at',
        'data',
    ];

    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
