<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepository;
use Illuminate\Support\Facades\Hash;

class EloquentUserRepository implements UserRepository
{
    public function create(array $data): User
    {
        // pastikan sudah divalidasi di FormRequest/Controller
        $data['password'] = Hash::make($data['password']);
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
