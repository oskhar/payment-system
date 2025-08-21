<?php

namespace App\Domains\Sales\TransactionModule\Data;

use Illuminate\Validation\Rules\Enum;
use App\Domains\Sales\TransactionModule\Enums\PaymentMethodEnum;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

class CreateTransactionData extends Data
{
    public function __construct(
        public string $transaction_number,
        public float $total_amount,
        public PaymentMethodEnum $payment_method,
        public int $branch_id,
        /** @var DataCollection<TransactionItemData> */
        #[DataCollectionOf(TransactionItemData::class)]
        public DataCollection $items,
    ) {}

    /**
     * Menambahkan aturan validasi untuk DTO utama
     */
    public static function rules(): array
    {
        return [
            'total_amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', new Enum(PaymentMethodEnum::class)],
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'items' => ['required', 'array', 'min:1'],
        ];
    }
}
