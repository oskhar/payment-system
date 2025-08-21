<?php

namespace Database\Seeders;

use App\Domains\Inventory\BranchModule\Models\Branch;
use App\Domains\Product\CategoryModule\Models\Category;
use App\Domains\Product\UnitModule\Models\Unit;
use App\Domains\Sales\UserModule\Models\Company;
use App\Domains\Sales\UserModule\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Nonaktifkan foreign key check untuk kelancaran proses seeding
        Schema::disableForeignKeyConstraints();

        // 2. Kosongkan semua tabel yang relevan
        Company::truncate();
        User::truncate();
        Branch::truncate();
        Unit::truncate();
        Category::truncate();
        // Tambahkan tabel lain jika perlu di-truncate
        // DB::table('items')->truncate();
        // DB::table('item_categories')->truncate();

        // 3. Simpan data JSON dari file export Anda
        $json_data = '[
            {"type":"header","version":"5.2.2","comment":"Export to JSON plugin for PHPMyAdmin"},
            {"type":"database","name":"u516004708_Rm537"},
            {"type":"table","name":"branches","database":"u516004708_Rm537","data":
            [
            {"id":"1","company_id":"1","name":"DRP MUVIE CELL","address":"Japan Raya, Sangiang, Maja, Lebak, Regency, Banten 42381","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-21 03:35:33"}
            ]
            }
            ,{"type":"table","name":"categories","database":"u516004708_Rm537","data":
            [
            {"id":"1","company_id":"1","name":"Bahan Pokok","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"2","company_id":"1","name":"Minuman Kemasan","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"3","company_id":"1","name":"Makanan Ringan","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"4","company_id":"1","name":"Bumbu Dapur","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"5","company_id":"1","name":"Makanan Instan & Kaleng","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"6","company_id":"1","name":"Susu & Produk Olahannya","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"7","company_id":"1","name":"Pembersih Rumah Tangga","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"8","company_id":"1","name":"Perlengkapan Mandi","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"9","company_id":"1","name":"Kebutuhan Dapur (Non-makanan)","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"10","company_id":"1","name":"Obat Nyamuk & Serangga","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"11","company_id":"1","name":"Popok Bayi (Diapers)","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"12","company_id":"1","name":"Susu & Makanan Bayi","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"13","company_id":"1","name":"Perlengkapan Mandi Bayi","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"14","company_id":"1","name":"Obat-obatan Umum","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"15","company_id":"1","name":"Perawatan Pribadi","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"16","company_id":"1","name":"Rokok","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"17","company_id":"1","name":"Alat Tulis Kantor (ATK)","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"18","company_id":"1","name":"Baterai & Elektronik Kecil","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"19","company_id":"1","name":"Lain-lain","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null}
            ]
            }
            ,{"type":"table","name":"companies","database":"u516004708_Rm537","data":
            [
            {"id":"1","name":"Toko Muvie","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53"}
            ]
            }
            ,{"type":"table","name":"units","database":"u516004708_Rm537","data":
            [
            {"id":"1","company_id":"1","name":"Satuan","abbreviation":"ST","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"2","company_id":"1","name":"Dus","abbreviation":"DS","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"3","company_id":"1","name":"Renceng","abbreviation":"RC","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"4","company_id":"1","name":"Liter","abbreviation":"LT","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"5","company_id":"1","name":"Kilogram","abbreviation":"KG","created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53","deleted_at":null},
            {"id":"6","company_id":"1","name":"PAK","abbreviation":"PK","created_at":"2025-08-21 04:33:32","updated_at":"2025-08-21 04:33:32","deleted_at":null},
            {"id":"7","company_id":"1","name":"TOPLES","abbreviation":"TPS","created_at":"2025-08-21 04:33:58","updated_at":"2025-08-21 04:33:58","deleted_at":null}
            ]
            }
            ,{"type":"table","name":"users","database":"u516004708_Rm537","data":
            [
            {"id":"1","name":"Admin","email":"admin@tokomuvie.com","email_verified_at":"2025-08-20 12:21:53","password":"$2y$12$Hvih9Nu.8P4E6xQgWakW1Os.ieJOt9CFu7zWb57\/\/kdGPoi600tTe","company_id":"1","remember_token":null,"created_at":"2025-08-20 12:21:53","updated_at":"2025-08-20 12:21:53"}
            ]
            }
        ]';

        // 4. Decode JSON dan siapkan data per tabel
        $decoded_data = json_decode($json_data, true);
        $tables = [];
        foreach ($decoded_data as $item) {
            if ($item['type'] === 'table') {
                $tables[$item['name']] = $item['data'];
            }
        }

        // 5. Masukkan data ke tabel sesuai urutan dependensi
        // Urutan: companies -> users, branches, units, categories

        if (!empty($tables['companies'])) {
            Company::insert($tables['companies']);
        }

        if (!empty($tables['users'])) {
            // Gunakan password dari JSON, karena ini adalah proses import
            User::insert($tables['users']);
        }

        if (!empty($tables['branches'])) {
            Branch::insert($tables['branches']);
        }
        
        if (!empty($tables['units'])) {
            // Langsung insert data karena nama kolom 'abbreviation' di JSON sudah sesuai
            Unit::insert($tables['units']);
        }

        if (!empty($tables['categories'])) {
            Category::insert($tables['categories']);
        }

        // 6. Aktifkan kembali foreign key check
        Schema::enableForeignKeyConstraints();

        $this->command->info('Database seeding completed successfully using JSON data.');
    }
}
