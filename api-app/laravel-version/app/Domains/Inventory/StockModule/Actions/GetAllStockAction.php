<?php

namespace App\Domains\Inventory\StockModule\Actions;

use App\Common\Data\FilterPaginationData;
use App\Domains\Inventory\StockModule\Data\StockData;
use App\Domains\Inventory\StockModule\Models\Stock;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class GetAllStockAction
{
    use AsAction;

    public function handle(FilterPaginationData $filter): array
    {
        $query = Stock::query()
            ->with(['item'])
            ->when($filter->search, function ($query, $search) {
                $query->where('transaction_number', 'LIKE', "%{$search}%");
            })
            ->when($filter->branch_id, function ($query, $branchId) {
                $query->where('branch_id', $branchId);
            });;
        $paginator = $query->paginate($filter->limit)->withQueryString();

        $stocks = StockData::collect($paginator->getCollection()->map(function (Stock $stock) {
            return [
                'id' => $stock->id,
                'item' => [
                    'id' => $stock->item->id,
                    'name' => $stock->item->name,
                ],
                'transaction_number' => $stock->transaction_number,
                'type' => $stock->type,
                'description' => $stock->description,
                'quantity' => $stock->quantity,
                'created_at' => $stock->created_at,
            ];
        }));

        return [
            'stocks' => $stocks,
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
        $result = $this->handle($filter);

        return response()->json($result);
    }
}
