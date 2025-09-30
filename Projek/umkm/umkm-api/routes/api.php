<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\CategoryController;


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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/seller/products', [ProductController::class, 'store']);
    Route::put('/seller/products/{id}', [ProductController::class, 'update']);
    Route::delete('/seller/products/{id}', [ProductController::class, 'destroy']);

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
