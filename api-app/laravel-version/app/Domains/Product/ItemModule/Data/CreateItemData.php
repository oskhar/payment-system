<?php

namespace App\Domains\Product\ItemModule\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

class CreateItemData extends Data
{
    public function __construct(
        public string $name,
        public string $barcode,
        public int $base_unit_id,

        /**
         * @var DataCollection<int, UnitData>
         */
        #[DataCollectionOf(UnitDataCollection::class)]
        public DataCollection $unit,

        /**
         * @var DataCollection<int, CategoryData>
         */
        #[DataCollectionOf(CategoryDataCollection::class)]
        public DataCollection $category,

        public ?string $description,

        #[Rule(['nullable', 'image', 'mimes:jpeg,png,jpg,svg,webp'])]
        public ?UploadedFile $image,

        public ?string $image_url,
    ) {}
}

class UnitDataCollection extends Data
{
    public function __construct(
        public int $id,
        public float $price,
        public float $cost,
        public float $conversion_to_base,
    ) {}
}

class CategoryDataCollection extends Data
{
    public function __construct(
        public int $id,
    ) {}
}
