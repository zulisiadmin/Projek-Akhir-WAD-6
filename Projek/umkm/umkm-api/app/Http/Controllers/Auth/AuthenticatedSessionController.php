<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class AuthenticatedSessionController extends Controller
{
    public function __construct(private readonly AuthService $auth) {}

    /**
     * Handle an incoming authentication request.
     */
public function store(\App\Http\Requests\Auth\LoginRequest $request): \Illuminate\Http\Response
{
    $request->authenticate();
    $request->session()->regenerate();
    return response()->noContent(); // SPA butuh 204
}


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $this->auth->logout($request);
        return response()->noContent();
    }
}
