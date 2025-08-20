<?php

namespace Database\Seeders;

use App\Domains\Sales\UserModule\Models\Company;
use App\Domains\Sales\UserModule\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $company = Company::create([
            'name' => 'Toko Muvie',
        ]);
        User::create([
            'company_id' => $company->id,
            'name' => 'Admin',
            'email' => 'admin@tokomuvie.com',
            'password' => bcrypt('muviesukses2025'),
            'email_verified_at' => now(),
        ]);
    }
}
