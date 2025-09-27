<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\Vendor;
use Illuminate\Validation\Rule;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', Rule::unique('users')],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            // tambahan untuk penjual
            'as_seller'   => ['sometimes', 'boolean'],
            'vendor_name' => ['required_if:as_seller,true', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => !empty($validated['as_seller']) ? 'seller' : 'customer',
        ]);

        if (!empty($validated['as_seller'])) {
            Vendor::create([
                'user_id' => $user->id,
                'name'    => $validated['vendor_name'],
            ]);
        }

        Auth::login($user);

        return response()->noContent(); // 204
    }
}