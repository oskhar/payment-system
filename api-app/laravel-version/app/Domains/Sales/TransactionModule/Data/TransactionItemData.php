<?php

namespace App\Domains\Sales\TransactionModule\Data;

use Spatie\LaravelData\Data;

class TransactionItemData extends Data
{
    public function __construct(
        public int $item_id,
        public int $unit_id,
        public int $quantity,
    ) {}

    /**
     * Menambahkan aturan validasi
     */
    public static function rules(): array
    {
        return [
            'item_id' => ['required', 'integer', 'exists:items,id'],
            'unit_id' => ['required', 'integer', 'exists:units,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
