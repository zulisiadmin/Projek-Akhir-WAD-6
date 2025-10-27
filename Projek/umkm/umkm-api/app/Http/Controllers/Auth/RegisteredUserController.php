<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;

class RegisteredUserController extends Controller
{
    public function __construct(private readonly AuthService $auth) {}

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'email', 'max:255', Rule::unique('users')],
            'password'    => ['required', 'confirmed', Rules\Password::defaults()],
            'as_seller'   => ['sometimes', 'boolean'],
            'vendor_name' => ['required_if:as_seller,true', 'string', 'max:255'],
        ]);

        $user = $this->auth->register($validated);

        Auth::login($user);
        return response()->noContent(); // 204
    }
}
