<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Vendor;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Category;



class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Admin & vendor owner demo
        $admin = User::firstOrCreate(['email'=>'admin@cakrawala.test'],[
            'name'=>'Admin Kampus','password'=>bcrypt('password'), 'role'=>'admin'
        ]);
        $owner = User::firstOrCreate(['email'=>'owner@umkm.test'],[
            'name'=>'Owner UMKM','password'=>bcrypt('password'), 'role'=>'vendor'
        ]);

        // Vendor contoh
        $vendor = Vendor::firstOrCreate(['slug'=>'kopi-kakak-level'],[
            'owner_id'=>$owner->id,'name'=>'Kopi Kakak Level','description'=>'Kopi dan teh kekinian',
            'status'=>'active','open_time'=>'09:00:00','close_time'=>'16:00:00'
        ]);
        $vendor->staffs()->syncWithoutDetaching([$owner->id => ['role'=>'owner']]);

        // Produk + varian
        $p1 = Product::firstOrCreate(['slug'=>'es-kopi-susu'],[
            'vendor_id'=>$vendor->id,'name'=>'Es Kopi Susu','base_price'=>15000,'status'=>'active','has_variants'=>true
        ]);
        ProductImage::firstOrCreate(['product_id'=>$p1->id,'url'=>'/images/demo/kopi.jpg'],['is_primary'=>true]);
        ProductVariant::firstOrCreate(['product_id'=>$p1->id,'name'=>'Regular'],['type'=>'option','price_delta'=>0,'is_default'=>true]);
        ProductVariant::firstOrCreate(['product_id'=>$p1->id,'name'=>'Large'],['type'=>'option','price_delta'=>3000]);

        $p2 = Product::firstOrCreate(['slug'=>'nasi-ayam-cakra'],[
            'vendor_id'=>$vendor->id,'name'=>'Nasi Ayam Cakra','base_price'=>20000,'status'=>'active','stock'=>50
        ]);

        // Relasi kategori
        $drink = Category::where('slug','minuman')->first();
        $food  = Category::where('slug','makanan-berat')->first();
        $p1->categories()->sync([$drink->id]);
        $p2->categories()->sync([$food->id]);
    }
}

