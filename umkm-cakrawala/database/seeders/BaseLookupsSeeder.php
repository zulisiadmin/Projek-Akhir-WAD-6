<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CampusLocation;
use App\Models\Category;

class BaseLookupsSeeder extends Seeder
{
    public function run(): void
    {
        // Lokasi pickup
        $locs = [
            ['name'=>'Kantin A','code'=>'KANTIN_A'],
            ['name'=>'Kantin B','code'=>'KANTIN_B'],
            ['name'=>'Lobi Perpustakaan','code'=>'LOBI_PERPUS'],
            ['name'=>'Gedung F','code'=>'GEDUNG_F'],
        ];
        foreach ($locs as $i=>$d) {
            CampusLocation::updateOrCreate(['code'=>$d['code']], $d + ['sort'=>$i]);
        }

        // Kategori
        $cats = [
            ['name'=>'Makanan Berat','slug'=>'makanan-berat'],
            ['name'=>'Minuman','slug'=>'minuman'],
            ['name'=>'Snack','slug'=>'snack'],
            ['name'=>'ATK','slug'=>'atk'],
        ];
        foreach ($cats as $c) Category::firstOrCreate(['slug'=>$c['slug']], $c);
    }
}

