<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampusLocation extends Model
{
    // kalau table-nya bukan "campus_locations", set manual:
    // protected $table = 'campus_locations';

    protected $fillable = [
        'name', 'code', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
