<?php

namespace App\Domains\Product\ItemModule\Actions;

use App\Common\Data\IdsData;
use App\Common\Exceptions\UnprocessableEntityException;
use App\Domains\Product\ItemModule\Models\Item;
use App\Domains\Product\ItemModule\Models\ItemCategory;
use App\Domains\Product\ItemModule\Models\ItemUnit;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;
use Symfony\Component\HttpFoundation\Response;

class DeleteItemAction
{
    use AsAction;

    public function handle(IdsData $idsData): void
    {
        $ids = $idsData->ids;

        // 1. Validasi eksistensi: Periksa apakah semua ID ada di database.
        $existingItemsCount = Item::whereIn('id', $ids)->count();

        if ($existingItemsCount !== count($ids)) {
            $foundIds = Item::whereIn('id', $ids)->pluck('id')->toArray();
            $notFoundIds = array_diff($ids, $foundIds);
            throw new UnprocessableEntityException(
                'Item dengan ID berikut tidak ditemukan: ' . implode(', ', $notFoundIds)
            );
        }

        DB::transaction(function () use ($ids) {
            // 2. Hapus entitas terkait terlebih dahulu.
            ItemUnit::whereIn('item_id', $ids)->delete();
            ItemCategory::whereIn('item_id', $ids)->delete();

            // 3. Hapus item utama.
            Item::whereIn('id', $ids)->delete();
        });
    }

    public function asController(IdsData $idsData): JsonResponse
    {
        $this->handle($idsData);
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
