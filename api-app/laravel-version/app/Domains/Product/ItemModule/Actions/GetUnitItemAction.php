<?php

namespace App\Domains\Product\ItemModule\Actions;

use App\Common\Exceptions\UnprocessableEntityException;
use App\Domains\Product\ItemModule\Models\Item;
use App\Domains\Product\ItemModule\Models\ItemUnit;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class GetUnitItemAction
{
    use AsAction;

    public function handle(string $id): mixed
    {
        $item = Item::find($id);

        if (!$item) {
            throw new UnprocessableEntityException('Item dengan ID ' . $id . ' tidak ditemukan.');
        }

        return $item->itemUnits()->with('unit')->get()->map(function (ItemUnit $itemUnit) {
            return [
                'id' => $itemUnit->unit->id,
                'name' => $itemUnit->unit->name,
                'abbreviation' => $itemUnit->unit->abbreviation,
            ];
        });
    }

    /**
     * Menjalankan action sebagai controller.
     *
     * @param Item $item
     * @return JsonResponse
     */
    public function asController(string $id): JsonResponse
    {
        $units = $this->handle($id);

        return response()->json([
            // Anda bisa langsung mengembalikan koleksinya
            'units' => $units,
        ]);
    }
}
