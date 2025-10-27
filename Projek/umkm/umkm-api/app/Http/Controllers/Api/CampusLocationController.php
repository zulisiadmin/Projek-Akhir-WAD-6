<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CampusLocation; // pastikan ada modelnya

class CampusLocationController extends Controller
{
    public function index()
    {
        // minimal fields untuk dropdown
        return CampusLocation::where('is_active', 1)
            ->orderBy('sort')
            ->get(['id','name','code']);
    }
}
