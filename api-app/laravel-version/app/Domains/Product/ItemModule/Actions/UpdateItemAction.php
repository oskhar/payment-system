<?php

namespace App\Domains\Product\ItemModule\Actions;

use App\Common\Services\ImageSaveService;
use App\Domains\Product\ItemModule\Data\UpdateItemData;
use App\Domains\Product\ItemModule\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateItemAction
{
    use AsAction;

    /**
     * @var ImageSaveService
     */
    private $imageSaveService;

    public function __construct(ImageSaveService $imageSaveService)
    {
        $this->imageSaveService = $imageSaveService;
    }

    /**
     * Logika inti untuk memperbarui item.
     *
     * @param Item $item Model item yang akan diupdate (didapat dari route-model binding).
     * @param UpdateItemData $updateItemData Data baru dari request.
     * @return void
     */
    public function handle(Item $item, UpdateItemData $updateItemData): void
    {
        dd($updateItemData->unit);
        $imagePath = $item->getRawOriginal('image_url');  // Ambil path gambar saat ini dari database

        // === 1. Logika untuk menangani upload gambar baru ===
        if ($updateItemData->image) {
            // Hapus gambar lama jika ada
            if ($imagePath) {
                // Hapus prefix '/' jika ada agar path sesuai dengan storage
                Storage::disk('public')->delete(ltrim($imagePath, '/'));
            }

            // Simpan gambar baru dan dapatkan path-nya
            $newImagePath = $this->imageSaveService->__invoke($updateItemData->image, 'uploads/images');
            $imagePath = '/' . $newImagePath;  // Simpan path baru dengan prefix '/'
        }

        // === 2. Update data utama pada model Item ===
        $item->update([
            'name' => $updateItemData->name,
            'barcode' => $updateItemData->barcode,
            'description' => $updateItemData->description,
            'image_url' => $imagePath,
            'base_unit_id' => $updateItemData->base_unit_id,
        ]);

        // === 3. Sinkronisasi Relasi (Best Practice) ===
        // Daripada mencari mana yang harus di-update, ditambah, atau dihapus,
        // cara paling aman dan sederhana adalah menghapus semua relasi lama
        // dan membuat ulang berdasarkan data baru.

        // Sinkronisasi Item Units
        $item->itemUnits()->delete();  // Hapus semua unit terkait yang lama
        foreach ($updateItemData->unit as $unitData) {
            $item->itemUnits()->create([
                'unit_id' => $unitData->id,
                'price' => $unitData->price,
                'cost' => $unitData->cost,
                'conversion_to_base' => $unitData->conversion_to_base,
            ]);
        }

        // Sinkronisasi Item Categories
        $item->itemCategories()->delete();  // Hapus semua kategori terkait yang lama
        foreach ($updateItemData->category as $categoryData) {
            $item->itemCategories()->create([
                'category_id' => $categoryData->id,
            ]);
        }
    }

    /**
     * Menjalankan action sebagai controller.
     *
     * @param Item $item Laravel akan otomatis mencari item berdasarkan {item} di URL.
     * @param UpdateItemData $updateItemData Data akan divalidasi dan di-cast ke DTO.
     * @return JsonResponse
     */
    public function asController(Item $item, UpdateItemData $updateItemData): JsonResponse
    {
        // === Best Practice: Otorisasi ===
        // Pastikan pengguna yang sedang login berhak mengedit item ini.
        if ($item->company_id !== Auth::user()->company_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Jalankan logika utama
        $this->handle($item, $updateItemData);

        // Kembalikan respons sukses
        return response()->json([
            'message' => 'Item updated successfully.',
        ]);
    }
}
