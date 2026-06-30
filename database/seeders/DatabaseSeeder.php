<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin eKOS
        User::factory()->create([
            'name' => 'Admin eKOS',
            'email' => 'admin@ekos.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2. Akun Penghuni/User eKOS
        User::factory()->create([
            'name' => 'Penghuni eKOS',
            'email' => 'user@ekos.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
    }
}
