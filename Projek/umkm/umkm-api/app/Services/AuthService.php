<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;
use App\Repositories\Contracts\VendorRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;

class AuthService
{
    public function __construct(
        private readonly UserRepository   $users,
        private readonly VendorRepository $vendors,
    ) {}

    /** Registrasi user (+ optional buat vendor) lalu return User. */
    public function register(array $validated): User
    {
        $role = !empty($validated['as_seller']) ? 'vendor' : 'customer';

        /** @var User $user */
        $user = $this->users->create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => $validated['password'], // akan di-hash di repository
            'role'     => $role,
        ]);

        if ($role === 'vendor') {
            $this->vendors->createForOwner($user->id, $validated['vendor_name']);
        }

        event(new Registered($user));
        return $user;
    }

    /** Login pakai kredensial standar Breeze. */
    public function login(array $credentials): bool
    {
        return Auth::attempt($credentials);
    }

    /** Logout + invalidate session. */
    public function logout(Request $request): void
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
