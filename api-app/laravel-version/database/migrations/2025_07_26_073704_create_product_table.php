<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_product_module_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * Perhatikan urutan pembuatan tabel untuk memenuhi foreign key constraints.
     */
    public function up(): void
    {
        // 1. Buat tabel 'units' dan 'categories' terlebih dahulu karena tidak memiliki dependensi.
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies');
            $table->string('name');
            $table->string('abbreviation', 10);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies');
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Buat tabel 'items' yang bergantung pada 'units'.
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies');
            $table->string('name');
            $table->string('barcode')->unique();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->foreignId('base_unit_id')->constrained('units');
            $table->timestamps();
            $table->softDeletes();
        });

        // 3. Buat tabel 'item_units' yang bergantung pada 'items' dan 'units'.
        Schema::create('item_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('unit_id')->constrained()->onDelete('cascade');
            $table->decimal('conversion_to_base', 10, 4);
            $table->decimal('price', 15, 2);
            $table->decimal('wholesale_price', 15, 2)->nullable();
            $table->decimal('cost', 15, 2);
            $table->timestamps();
            $table->softDeletes();
        });

        // 4. Buat tabel pivot 'item_categories' yang bergantung pada 'items' dan 'categories'.
        Schema::create('item_categories', function (Blueprint $table) {
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->primary(['item_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     * Hapus tabel dalam urutan terbalik untuk menghindari error foreign key.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_categories');
        Schema::dropIfExists('item_units');
        Schema::dropIfExists('items');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('units');
    }
};
