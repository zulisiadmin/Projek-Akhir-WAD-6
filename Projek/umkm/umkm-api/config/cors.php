<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // cukup ini
    'allowed_origins' => ['http://localhost:5173'],  // ✅ benar di sini
    // atau kalau kamu pakai 127.0.0.1 di FE: ['http://127.0.0.1:5173']
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
