<?php

namespace App\Domains\Product\ItemModule\Actions;

use App\Common\Data\FilterPaginationData;
use App\Domains\Inventory\StockModule\Services\GetStockService;
use App\Domains\Product\ItemModule\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class GetAllItemAction
{
    use AsAction;

    public function handle(FilterPaginationData $filter): array
    {
        // 2. Bangun query Eloquent
        $query = Item::query()
            ->where('company_id', Auth::user()->company_id)
            ->with(['baseUnit', 'itemCategories.category', 'itemUnits.unit'])
            ->when($filter->search, function ($query, $search) {
                $query->where('name', 'LIKE', "%{$search}%");
            });

        // 3. Eksekusi query dengan paginasi
        $paginator = $query->paginate($filter->limit)->withQueryString();

        // 4. Transformasi hasil untuk menambahkan data harga, biaya, dan stok
        $transformedItems = $paginator->getCollection()->map(function (Item $item) use ($filter) {
            $baseItemUnit = $item->itemUnits->firstWhere('unit_id', $item->base_unit_id);

            return [
                'id' => $item->id,
                'name' => $item->name,
                'barcode' => $item->barcode,
                'description' => $item->description,
                'image_url' => $item->image_url,
                'base_unit' => $item->baseUnit,
                'categories' => $item->categories,
                'item_units' => $item->itemUnits,
                'base_unit_id' => $item->base_unit_id,
                'price' => $baseItemUnit?->price,
                'wholesale_price' => $baseItemUnit?->wholesale_price,
                'cost' => $baseItemUnit?->cost,
                'stock' => (new GetStockService())($filter->branch_id, $item->id),
            ];
        });

        // 5. Format respons akhir agar sesuai dengan struktur yang diinginkan
        return [
            'items' => $transformedItems,
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'total_page' => $paginator->lastPage(),
                'links' => [
                    'first' => $paginator->url(1),
                    'prev' => $paginator->previousPageUrl(),
                    'next' => $paginator->nextPageUrl(),
                    'last' => $paginator->url($paginator->lastPage()),
                ],
            ],
        ];
    }

    public function asController(FilterPaginationData $filter): JsonResponse
    {
        return response()->json(
            $this->handle($filter)
        );
    }
}
