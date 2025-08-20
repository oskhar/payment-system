<?php

namespace App\Domains\Product\ItemModule\Actions;

use App\Common\Services\ImageSaveService;
use App\Domains\Product\ItemModule\Data\CreateItemData;
use App\Domains\Product\ItemModule\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateItemAction
{
    use AsAction;

    public function handle(CreateItemData $createItemData): void
    {
        $imagePath = null;

        // Cek jika ada gambar yang diunggah
        if ($createItemData->image) {
            // Jalankan Action untuk menyimpan gambar
            $imagePath = (new ImageSaveService)($createItemData->image, 'uploads/images');
        }

        // Simpan data ke database
        $item = Item::create([
            'company_id' => Auth::user()->company_id,
            'name' => $createItemData->name,
            'barcode' => $createItemData->barcode,
            'description' => $createItemData->description,
            'image_url' => '/' . $imagePath,
            'base_unit_id' => $createItemData->base_unit_id,
        ]);

        foreach ($createItemData->unit as $unitData) {
            $item->itemUnits()->create([
                'unit_id' => $unitData->id,
                'price' => $unitData->price,
                'wholesale_price' => $unitData->wholesale_price,
                'cost' => $unitData->cost,
                'conversion_to_base' => $unitData->conversion_to_base,
            ]);
        }

        foreach ($createItemData->category as $categoryData) {
            $item->itemCategories()->create([
                'category_id' => $categoryData->id,
            ]);
        }
    }

    public function asController(CreateItemData $createItemData): JsonResponse
    {
        $this->handle($createItemData);

        return response()->json([
            'message' => 'Item created successfully.',
        ]);
    }
}
