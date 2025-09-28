<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

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
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'email', 'max:255', Rule::unique('users')],
            'password'    => ['required', 'confirmed', Rules\Password::defaults()],
            'as_seller'   => ['sometimes', 'boolean'], // tombol daftar sebagai penjual
            'vendor_name' => ['required_if:as_seller,true', 'string', 'max:255'],
        ]);

        $user = DB::transaction(function () use ($validated) {
            // role: jika as_seller=true => vendor, else customer
            $role = !empty($validated['as_seller']) ? 'vendor' : 'customer';

            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role'     => $role,
            ]);

            if ($role === 'vendor') {
                $name = $validated['vendor_name'];

                // slug unik untuk vendor
                $base = Str::slug($name);
                $slug = $base; $i = 1;
                while (Vendor::where('slug', $slug)->exists()) {
                    $slug = $base.'-'.$i++;
                }

                Vendor::create([
                    'owner_id' => $user->id,   // sesuai struktur tabel
                    'name'     => $name,
                    'slug'     => $slug,
                ]);
            }

            event(new Registered($user));
            return $user;
        });

        Auth::login($user);
        return response()->noContent(); // 204
    }

}
