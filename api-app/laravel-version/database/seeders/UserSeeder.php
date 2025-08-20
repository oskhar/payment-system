<?php

namespace Database\Seeders;

use App\Domains\Inventory\BranchModule\Models\Branch;
use App\Domains\Product\CategoryModule\Models\Category;
use App\Domains\Product\UnitModule\Models\Unit;
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
        $createUnits = [
            [
                'company_id' => $company->id,
                'name' => 'Satuan',
                'abbreviation' => 'ST',
            ],
            [
                'company_id' => $company->id,
                'name' => 'Dus',
                'abbreviation' => 'DS',
            ],
            [
                'company_id' => $company->id,
                'name' => 'Renceng',
                'abbreviation' => 'RC',
            ],
            [
                'company_id' => $company->id,
                'name' => 'Liter',
                'abbreviation' => 'LT',
            ],
            [
                'company_id' => $company->id,
                'name' => 'Kilogram',
                'abbreviation' => 'KG',
            ],
        ];
        foreach ($createUnits as $unit) {
            Unit::create($unit);
        }
        $createBranches = [
            [
                'company_id' => $company->id,
                'name' => 'Branch 1',
                'address' => 'Jl. Kebon Jeruk, Jakarta',
            ],
        ];
        foreach ($createBranches as $branch) {
            Branch::create($branch);
        }

        $createCategories = [
            // --- Makanan & Minuman ---
            ['company_id' => $company->id, 'name' => 'Bahan Pokok'],
            ['company_id' => $company->id, 'name' => 'Minuman Kemasan'],
            ['company_id' => $company->id, 'name' => 'Makanan Ringan'],
            ['company_id' => $company->id, 'name' => 'Bumbu Dapur'],
            ['company_id' => $company->id, 'name' => 'Makanan Instan & Kaleng'],
            ['company_id' => $company->id, 'name' => 'Susu & Produk Olahannya'],
            // --- Kebutuhan Rumah Tangga ---
            ['company_id' => $company->id, 'name' => 'Pembersih Rumah Tangga'],
            ['company_id' => $company->id, 'name' => 'Perlengkapan Mandi'],
            ['company_id' => $company->id, 'name' => 'Kebutuhan Dapur (Non-makanan)'],
            ['company_id' => $company->id, 'name' => 'Obat Nyamuk & Serangga'],
            // --- Perawatan Bayi & Anak ---
            ['company_id' => $company->id, 'name' => 'Popok Bayi (Diapers)'],
            ['company_id' => $company->id, 'name' => 'Susu & Makanan Bayi'],
            ['company_id' => $company->id, 'name' => 'Perlengkapan Mandi Bayi'],
            // --- Kesehatan & Perawatan Diri ---
            ['company_id' => $company->id, 'name' => 'Obat-obatan Umum'],
            ['company_id' => $company->id, 'name' => 'Perawatan Pribadi'],
            // --- Lain-lain ---
            ['company_id' => $company->id, 'name' => 'Rokok'],
            ['company_id' => $company->id, 'name' => 'Alat Tulis Kantor (ATK)'],
            ['company_id' => $company->id, 'name' => 'Baterai & Elektronik Kecil'],
            ['company_id' => $company->id, 'name' => 'Lain-lain'],
        ];

        foreach ($createCategories as $category) {
            Category::create($category);
        }
    }
}
