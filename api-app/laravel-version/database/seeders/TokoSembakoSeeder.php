<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TokoSembakoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Nonaktifkan foreign key check
        Schema::disableForeignKeyConstraints();

        // 2. Kosongkan semua tabel yang relevan
        DB::table('items')->truncate();
        DB::table('item_categories')->truncate();
        DB::table('item_units')->truncate();
        DB::table('stocks')->truncate();
        DB::table('transactions')->truncate();
        DB::table('transaction_items')->truncate();

        // 3. Simpan data JSON lengkap dari file export Anda
        $json_data = '[
            {"type":"header","version":"5.2.2","comment":"Export to JSON plugin for PHPMyAdmin"},
            {"type":"database","name":"u516004708_Rm537"},
            {"type":"table","name":"items","database":"u516004708_Rm537","data":
            [
            {"id":"1","company_id":"1","name":"Tes","barcode":"444","description":null,"image_url":"\/uploads\/images\/1755717819-68a620bb1499d.webp","base_unit_id":"1","created_at":"2025-08-20 12:23:39","updated_at":"2025-08-21 00:23:32","deleted_at":"2025-08-21 00:23:32"},
            {"id":"2","company_id":"1","name":"Sampoerna Mild 16","barcode":"333","description":null,"image_url":"\/uploads\/images\/1755735893-68a6675549f49.jpg","base_unit_id":"1","created_at":"2025-08-21 00:24:53","updated_at":"2025-08-21 01:15:09","deleted_at":"2025-08-21 01:15:09"},
            {"id":"4","company_id":"1","name":"Sampoerna Mild 16","barcode":"334","description":null,"image_url":"\/uploads\/images\/1755739016-68a67388e1477.jpg","base_unit_id":"1","created_at":"2025-08-21 01:16:56","updated_at":"2025-08-21 01:19:28","deleted_at":"2025-08-21 01:19:28"},
            {"id":"6","company_id":"1","name":"Sampoerna Mild 16","barcode":"8999909096004","description":null,"image_url":"\/uploads\/images\/1755739252-68a674742a449.jpg","base_unit_id":"1","created_at":"2025-08-21 01:20:52","updated_at":"2025-08-21 03:39:52","deleted_at":"2025-08-21 03:39:52"},
            {"id":"13","company_id":"1","name":"Sampoerna mild 16","barcode":"899990909600","description":null,"image_url":"\/uploads\/images\/1755747924-68a69654f06d0.jpeg","base_unit_id":"1","created_at":"2025-08-21 03:45:24","updated_at":"2025-08-21 04:42:56","deleted_at":"2025-08-21 04:42:56"},
            {"id":"14","company_id":"1","name":"SOSIS SO NICE","barcode":"66","description":null,"image_url":"\/uploads\/images\/1755750983-68a6a247d7a2f.jpg","base_unit_id":"7","created_at":"2025-08-21 04:36:23","updated_at":"2025-08-21 06:11:43","deleted_at":"2025-08-21 06:11:43"},
            {"id":"15","company_id":"1","name":"Tes","barcode":"222","description":null,"image_url":"\/uploads\/images\/1755751438-68a6a40e94b50.jpg","base_unit_id":"1","created_at":"2025-08-21 04:43:58","updated_at":"2025-08-21 04:45:53","deleted_at":"2025-08-21 04:45:53"},
            {"id":"16","company_id":"1","name":"TOPAS KRETEK","barcode":"888888","description":null,"image_url":"\/","base_unit_id":"6","created_at":"2025-08-21 05:03:38","updated_at":"2025-08-21 06:11:52","deleted_at":"2025-08-21 06:11:52"},
            {"id":"33","company_id":"1","name":"ON LINE 20","barcode":"8997014443065","description":null,"image_url":"\/","base_unit_id":"1","created_at":"2025-08-21 06:07:08","updated_at":"2025-08-21 06:11:58","deleted_at":"2025-08-21 06:11:58"},
            {"id":"39","company_id":"1","name":"GG FILTER","barcode":"8998989100120","description":null,"image_url":"\/","base_unit_id":"1","created_at":"2025-08-21 06:26:27","updated_at":"2025-08-21 06:26:27","deleted_at":null},
            {"id":"40","company_id":"1","name":"MAX 20","barcode":"8994557315125","description":null,"image_url":"\/","base_unit_id":"1","created_at":"2025-08-21 06:30:46","updated_at":"2025-08-21 06:30:46","deleted_at":null},
            {"id":"41","company_id":"1","name":"SURYA 16","barcode":"8998989110167","description":null,"image_url":"\/","base_unit_id":"1","created_at":"2025-08-21 06:52:09","updated_at":"2025-08-21 06:52:09","deleted_at":null},
            {"id":"42","company_id":"1","name":"SURYA 12","barcode":"8998989300261","description":null,"image_url":"\/","base_unit_id":"1","created_at":"2025-08-21 06:57:59","updated_at":"2025-08-21 06:57:59","deleted_at":null},
            {"id":"43","company_id":"1","name":"SIGNATURE","barcode":"8998989300155","description":null,"image_url":"\/","base_unit_id":"1","created_at":"2025-08-21 07:30:53","updated_at":"2025-08-21 07:30:53","deleted_at":null},
            {"id":"44","company_id":"1","name":"NESLITE HITAM","barcode":"8993319163776","description":null,"image_url":"\/","base_unit_id":"1","created_at":"2025-08-21 09:07:55","updated_at":"2025-08-21 09:07:55","deleted_at":null},
            {"id":"45","company_id":"1","name":"NESLITE MENTOL","barcode":"8993319163578","description":null,"image_url":"\/","base_unit_id":"1","created_at":"2025-08-21 09:19:32","updated_at":"2025-08-21 09:19:32","deleted_at":null}
            ]
            }
            ,{"type":"table","name":"item_categories","database":"u516004708_Rm537","data":
            [
            {"item_id":"39","category_id":"16"},
            {"item_id":"40","category_id":"16"},
            {"item_id":"41","category_id":"16"},
            {"item_id":"42","category_id":"16"},
            {"item_id":"43","category_id":"16"},
            {"item_id":"44","category_id":"16"},
            {"item_id":"45","category_id":"16"}
            ]
            }
            ,{"type":"table","name":"item_units","database":"u516004708_Rm537","data":
            [
            {"id":"1","item_id":"1","unit_id":"1","conversion_to_base":"1.0000","price":"3000.00","wholesale_price":"2000.00","cost":"1000.00","created_at":"2025-08-20 12:23:39","updated_at":"2025-08-21 00:23:32","deleted_at":"2025-08-21 00:23:32"},
            {"id":"2","item_id":"2","unit_id":"1","conversion_to_base":"1.0000","price":"3000.00","wholesale_price":"2000.00","cost":"1000.00","created_at":"2025-08-21 00:24:53","updated_at":"2025-08-21 01:15:09","deleted_at":"2025-08-21 01:15:09"},
            {"id":"3","item_id":"4","unit_id":"1","conversion_to_base":"1.0000","price":"3000.00","wholesale_price":"2500.00","cost":"1000.00","created_at":"2025-08-21 01:16:56","updated_at":"2025-08-21 01:19:28","deleted_at":"2025-08-21 01:19:28"},
            {"id":"4","item_id":"6","unit_id":"1","conversion_to_base":"1.0000","price":"3000.00","wholesale_price":"2500.00","cost":"1000.00","created_at":"2025-08-21 01:20:52","updated_at":"2025-08-21 03:39:43","deleted_at":"2025-08-21 03:39:43"},
            {"id":"5","item_id":"13","unit_id":"1","conversion_to_base":"1.0000","price":"36000.00","wholesale_price":"33500.00","cost":"32500.00","created_at":"2025-08-21 03:45:24","updated_at":"2025-08-21 04:13:44","deleted_at":"2025-08-21 04:13:44"},
            {"id":"6","item_id":"14","unit_id":"7","conversion_to_base":"1.0000","price":"20000.00","wholesale_price":"20000.00","cost":"19000.00","created_at":"2025-08-21 04:36:23","updated_at":"2025-08-21 06:11:43","deleted_at":"2025-08-21 06:11:43"},
            {"id":"7","item_id":"15","unit_id":"1","conversion_to_base":"1.0000","price":"36000.00","wholesale_price":"35500.00","cost":"33200.00","created_at":"2025-08-21 04:43:58","updated_at":"2025-08-21 04:45:53","deleted_at":"2025-08-21 04:45:53"},
            {"id":"8","item_id":"16","unit_id":"6","conversion_to_base":"1.0000","price":"82000.00","wholesale_price":"82000.00","cost":"78000.00","created_at":"2025-08-21 05:03:38","updated_at":"2025-08-21 06:11:52","deleted_at":"2025-08-21 06:11:52"},
            {"id":"9","item_id":"33","unit_id":"1","conversion_to_base":"1.0000","price":"30000.00","wholesale_price":"28500.00","cost":"28000.00","created_at":"2025-08-21 06:07:08","updated_at":"2025-08-21 06:11:58","deleted_at":"2025-08-21 06:11:58"},
            {"id":"10","item_id":"39","unit_id":"1","conversion_to_base":"1.0000","price":"27000.00","wholesale_price":"25500.00","cost":"24850.00","created_at":"2025-08-21 06:26:27","updated_at":"2025-08-21 06:26:27","deleted_at":null},
            {"id":"11","item_id":"39","unit_id":"6","conversion_to_base":"20.0000","price":"505000.00","wholesale_price":"500000.00","cost":"49700.00","created_at":"2025-08-21 06:26:27","updated_at":"2025-08-21 06:26:27","deleted_at":null},
            {"id":"12","item_id":"40","unit_id":"1","conversion_to_base":"1.0000","price":"30000.00","wholesale_price":"27500.00","cost":"26800.00","created_at":"2025-08-21 06:30:46","updated_at":"2025-08-21 06:30:46","deleted_at":null},
            {"id":"13","item_id":"40","unit_id":"6","conversion_to_base":"10.0000","price":"275000.00","wholesale_price":"272000.00","cost":"268000.00","created_at":"2025-08-21 06:30:46","updated_at":"2025-08-21 06:30:46","deleted_at":null},
            {"id":"14","item_id":"41","unit_id":"1","conversion_to_base":"1.0000","price":"36000.00","wholesale_price":"34500.00","cost":"33600.00","created_at":"2025-08-21 06:52:09","updated_at":"2025-08-21 06:52:09","deleted_at":null},
            {"id":"15","item_id":"41","unit_id":"6","conversion_to_base":"10.0000","price":"345000.00","wholesale_price":"340000.00","cost":"336000.00","created_at":"2025-08-21 06:52:09","updated_at":"2025-08-21 06:52:09","deleted_at":null},
            {"id":"16","item_id":"42","unit_id":"1","conversion_to_base":"1.0000","price":"27000.00","wholesale_price":"25500.00","cost":"24600.00","created_at":"2025-08-21 06:57:59","updated_at":"2025-08-21 06:57:59","deleted_at":null},
            {"id":"17","item_id":"42","unit_id":"6","conversion_to_base":"10.0000","price":"255000.00","wholesale_price":"250000.00","cost":"246000.00","created_at":"2025-08-21 06:57:59","updated_at":"2025-08-21 06:57:59","deleted_at":null},
            {"id":"18","item_id":"43","unit_id":"1","conversion_to_base":"1.0000","price":"26000.00","wholesale_price":"23500.00","cost":"23100.00","created_at":"2025-08-21 07:30:53","updated_at":"2025-08-21 07:30:53","deleted_at":null},
            {"id":"19","item_id":"43","unit_id":"6","conversion_to_base":"10.0000","price":"240000.00","wholesale_price":"235000.00","cost":"231000.00","created_at":"2025-08-21 07:30:53","updated_at":"2025-08-21 07:30:53","deleted_at":null},
            {"id":"20","item_id":"44","unit_id":"1","conversion_to_base":"1.0000","price":"23000.00","wholesale_price":"21500.00","cost":"20800.00","created_at":"2025-08-21 09:07:55","updated_at":"2025-08-21 09:07:55","deleted_at":null},
            {"id":"21","item_id":"44","unit_id":"6","conversion_to_base":"10.0000","price":"213000.00","wholesale_price":"213000.00","cost":"208000.00","created_at":"2025-08-21 09:07:55","updated_at":"2025-08-21 09:07:55","deleted_at":null},
            {"id":"22","item_id":"45","unit_id":"1","conversion_to_base":"1.0000","price":"22000.00","wholesale_price":"21500.00","cost":"20800.00","created_at":"2025-08-21 09:19:32","updated_at":"2025-08-21 09:19:32","deleted_at":null},
            {"id":"23","item_id":"45","unit_id":"6","conversion_to_base":"10.0000","price":"212000.00","wholesale_price":"212000.00","cost":"208000.00","created_at":"2025-08-21 09:19:32","updated_at":"2025-08-21 09:19:32","deleted_at":null}
            ]
            }
            ,{"type":"table","name":"stocks","database":"u516004708_Rm537","data":
            [
            {"id":"1","branch_id":"1","item_id":"16","transaction_number":"STX0001","quantity":"10","type":"in","description":null,"created_at":"2025-08-21 05:04:25","updated_at":"2025-08-21 05:04:25"},
            {"id":"2","branch_id":"1","item_id":"14","transaction_number":"STX0002","quantity":"20","type":"in","description":null,"created_at":"2025-08-21 05:04:42","updated_at":"2025-08-21 05:04:42"},
            {"id":"3","branch_id":"1","item_id":"33","transaction_number":"STX0003","quantity":"10","type":"in","description":null,"created_at":"2025-08-21 06:07:34","updated_at":"2025-08-21 06:07:34"},
            {"id":"4","branch_id":"1","item_id":"39","transaction_number":"STX0004","quantity":"40","type":"in","description":null,"created_at":"2025-08-21 06:45:38","updated_at":"2025-08-21 06:45:38"},
            {"id":"5","branch_id":"1","item_id":"40","transaction_number":"STX0005","quantity":"10","type":"in","description":null,"created_at":"2025-08-21 06:45:59","updated_at":"2025-08-21 06:45:59"},
            {"id":"6","branch_id":"1","item_id":"41","transaction_number":"STX0006","quantity":"20","type":"in","description":null,"created_at":"2025-08-21 06:52:36","updated_at":"2025-08-21 06:52:36"},
            {"id":"7","branch_id":"1","item_id":"42","transaction_number":"STX0007","quantity":"20","type":"in","description":null,"created_at":"2025-08-21 06:58:11","updated_at":"2025-08-21 06:58:11"},
            {"id":"8","branch_id":"1","item_id":"43","transaction_number":"STX0008","quantity":"20","type":"in","description":null,"created_at":"2025-08-21 07:31:07","updated_at":"2025-08-21 07:31:07"},
            {"id":"9","branch_id":"1","item_id":"44","transaction_number":"STX0009","quantity":"20","type":"in","description":null,"created_at":"2025-08-21 09:19:45","updated_at":"2025-08-21 09:19:45"},
            {"id":"10","branch_id":"1","item_id":"45","transaction_number":"STX0010","quantity":"20","type":"in","description":null,"created_at":"2025-08-21 09:19:56","updated_at":"2025-08-21 09:19:56"}
            ]
            }
            ,{"type":"table","name":"transactions","database":"u516004708_Rm537","data":
            [
            {"id":"4","created_by":"1","branch_id":"1","transaction_number":"auto","total_amount":"12000.00","payment_method":"cash","created_at":"2025-08-20 15:55:13","updated_at":"2025-08-20 15:55:13"},
            {"id":"5","created_by":"1","branch_id":"1","transaction_number":"TRS0001","total_amount":"9000.00","payment_method":"cash","created_at":"2025-08-20 16:22:04","updated_at":"2025-08-20 16:22:04"},
            {"id":"6","created_by":"1","branch_id":"1","transaction_number":"TS0001","total_amount":"167500.00","payment_method":"cash","created_at":"2025-08-21 03:49:15","updated_at":"2025-08-21 03:49:15"},
            {"id":"12","created_by":"1","branch_id":"1","transaction_number":"TS0003","total_amount":"102000.00","payment_method":"cash","created_at":"2025-08-21 05:05:35","updated_at":"2025-08-21 05:05:35"},
            {"id":"13","created_by":"1","branch_id":"1","transaction_number":"TS0004","total_amount":"30000.00","payment_method":"cash","created_at":"2025-08-21 06:07:56","updated_at":"2025-08-21 06:07:56"},
            {"id":"18","created_by":"1","branch_id":"1","transaction_number":"TS0009","total_amount":"27000.00","payment_method":"cash","created_at":"2025-08-21 07:38:10","updated_at":"2025-08-21 07:38:10"},
            {"id":"19","created_by":"1","branch_id":"1","transaction_number":"TS0011","total_amount":"30000.00","payment_method":"cash","created_at":"2025-08-21 11:57:17","updated_at":"2025-08-21 11:57:17"}
            ]
            }
            ,{"type":"table","name":"transaction_items","database":"u516004708_Rm537","data":
            [
            {"id":"1","transaction_id":"4","item_id":"1","unit_id":"1","quantity":"4","price":"3000.00","total_amount":"12000.00","created_at":"2025-08-20 15:55:13","updated_at":"2025-08-20 15:55:13"},
            {"id":"2","transaction_id":"5","item_id":"1","unit_id":"1","quantity":"3","price":"3000.00","total_amount":"9000.00","created_at":"2025-08-20 16:22:04","updated_at":"2025-08-20 16:22:04"},
            {"id":"3","transaction_id":"6","item_id":"13","unit_id":"1","quantity":"5","price":"33500.00","total_amount":"167500.00","created_at":"2025-08-21 03:49:15","updated_at":"2025-08-21 03:49:15"},
            {"id":"4","transaction_id":"12","item_id":"16","unit_id":"6","quantity":"1","price":"82000.00","total_amount":"82000.00","created_at":"2025-08-21 05:05:35","updated_at":"2025-08-21 05:05:35"},
            {"id":"5","transaction_id":"12","item_id":"14","unit_id":"7","quantity":"1","price":"20000.00","total_amount":"20000.00","created_at":"2025-08-21 05:05:35","updated_at":"2025-08-21 05:05:35"},
            {"id":"6","transaction_id":"13","item_id":"33","unit_id":"1","quantity":"1","price":"30000.00","total_amount":"30000.00","created_at":"2025-08-21 06:07:56","updated_at":"2025-08-21 06:07:56"},
            {"id":"7","transaction_id":"18","item_id":"39","unit_id":"1","quantity":"1","price":"27000.00","total_amount":"27000.00","created_at":"2025-08-21 07:38:10","updated_at":"2025-08-21 07:38:10"},
            {"id":"8","transaction_id":"19","item_id":"40","unit_id":"1","quantity":"1","price":"30000.00","total_amount":"30000.00","created_at":"2025-08-21 11:57:17","updated_at":"2025-08-21 11:57:17"}
            ]
            }
        ]';

        // 4. Decode JSON dan siapkan data per tabel
        $decoded_data = json_decode($json_data, true);
        $tables = [];
        foreach ($decoded_data as $item) {
            if (isset($item['type']) && $item['type'] === 'table') {
                $tables[$item['name']] = $item['data'];
            }
        }

        // 5. Masukkan data ke tabel sesuai urutan dependensi
        // Urutan: items -> item_units -> item_categories -> stocks -> transactions -> transaction_items
        
        if (!empty($tables['items'])) {
            DB::table('items')->insert($tables['items']);
        }
        
        if (!empty($tables['item_units'])) {
            DB::table('item_units')->insert($tables['item_units']);
        }

        if (!empty($tables['item_categories'])) {
            DB::table('item_categories')->insert($tables['item_categories']);
        }

        if (!empty($tables['stocks'])) {
            DB::table('stocks')->insert($tables['stocks']);
        }

        if (!empty($tables['transactions'])) {
            DB::table('transactions')->insert($tables['transactions']);
        }
        
        if (!empty($tables['transaction_items'])) {
            DB::table('transaction_items')->insert($tables['transaction_items']);
        }

        // 6. Aktifkan kembali foreign key check
        Schema::enableForeignKeyConstraints();

        $this->command->info('Item and related data seeding completed successfully.');
    }
}
