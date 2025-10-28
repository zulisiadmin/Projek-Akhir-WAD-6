<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\CategoryController;
use App\Models\CampusLocation;
use App\Http\Controllers\Api\CampusLocationController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\VendorOrderController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{idOrSlug}', [ProductController::class, 'show']);
Route::get('/campus-locations', [CampusLocationController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
// routes/api.php
Route::get('/campus-locations', function () {
    $rows = CampusLocation::query()
        ->where('is_active', true)
        ->orderBy('name')
        ->get(['id','name','code']);

    // JSON no-cache & no ETag supaya gak ada 304/200 tanpa body
    return response()->json(['data' => $rows], 200, [
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma'        => 'no-cache',
        'Expires'       => '0',
    ], JSON_UNESCAPED_UNICODE);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/seller/products', [ProductController::class, 'store']);
    Route::put('/seller/products/{id}', [ProductController::class, 'update']);
    Route::delete('/seller/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/seller/products', [ProductController::class, 'sellerIndex']);
    Route::get('/categories', function () {
    return \App\Models\Category::select('id','name')->orderBy('name')->paginate(100);
    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/vendor/orders', [VendorOrderController::class, 'index']);
    Route::get('/vendor/orders/{order}', [VendorOrderController::class, 'show']);
    });
});

    // opsional kalau mau dipakai di FE
    Route::get('/me', fn(\Illuminate\Http\Request $r) => $r->user());
});

Route::middleware('auth:sanctum')->get('/user', function (Illuminate\Http\Request $r) {
    return $r->user();
});

Route::get('/categories', function () {
    // simple list tanpa paginator
    return Category::select('id','name','slug','icon','parent_id')
        ->orderBy('name','asc')
        ->get();
});

// ATAU jika pakai paginator:
Route::get('/categories-paged', function () {
    return Category::select('id','name','slug','icon','parent_id')
        ->orderBy('name','asc')
        ->paginate(50);
});

Route::get('/categories', [CategoryController::class, 'index']);


// penting: route auth breeze (api/login, api/register, dll)
require __DIR__.'/auth.php';
