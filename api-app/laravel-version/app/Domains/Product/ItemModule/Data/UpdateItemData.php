<?php

namespace App\Domains\Product\ItemModule\Data;

use App\Domains\Product\CategoryModule\Data\CategoryRelationData;
use App\Domains\Product\UnitModule\Data\UnitRelationData;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateItemData extends Data
{
    public function __construct(
        public string $name,
        #[Rule('sometimes')]  // Barcode mungkin tidak selalu diubah
        public ?string $barcode,
        public ?string $description,
        public int $base_unit_id,

        /**
         * @var UnitRelationData[]
         */
        public array $unit,

        /**
         * @var CategoryRelationData[]
         */
        public array $category,
        public ?UploadedFile $image,  // Nullable, karena gambar tidak selalu di-update
    ) {}
}
