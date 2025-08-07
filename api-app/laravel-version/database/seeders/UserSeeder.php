<?php

namespace Database\Seeders;

use App\Domains\Sales\UserModule\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@tokomuvie.com',
            'password' => bcrypt('muviesukses2025'),
            'email_verified_at' => now(),
        ]);
    }
}
