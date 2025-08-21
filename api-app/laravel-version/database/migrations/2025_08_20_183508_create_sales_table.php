<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('branch_id')->constrained('branches');

            $table->string('transaction_number')->unique();
            $table->decimal('total_amount', 15, 2);

            $table->enum('payment_method', ['cash', 'bca', 'mandiri', 'bri', 'dana']);
            $table->timestamps();
        });

        Schema::create('transaction_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transactions')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('items');
            $table->foreignId('unit_id')->constrained('units');

            $table->unsignedInteger('quantity');
            $table->decimal('price', 15, 2);
            $table->decimal('total_amount', 15, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_items');
        Schema::dropIfExists('transactions');
    }
};
