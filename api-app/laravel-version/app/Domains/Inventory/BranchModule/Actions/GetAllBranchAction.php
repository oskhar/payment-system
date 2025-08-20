<?php

namespace App\Domains\Inventory\BranchModule\Actions;

use App\Common\Data\FilterPaginationData;
use App\Domains\Inventory\BranchModule\Data\BranchData;
use App\Domains\Inventory\BranchModule\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class GetAllBranchAction
{
    use AsAction;

    /**
     * Meng-handle logika untuk mengambil semua data cabang dengan filter,
     * sorting, dan pagination.
     */
    public function handle(FilterPaginationData $filter): array
    {
        $query = Branch::query()
            ->where('company_id', Auth::user()->company_id)
            ->when($filter->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q
                        ->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('code', 'LIKE', "%{$search}%");
                });
            })
            ->when($filter->sort_by, function ($query, $sortBy) use ($filter) {
                $query->orderBy($sortBy, $filter->sort_type ?? 'asc');
            }, function ($query) {
                $query->orderBy('created_at', 'desc');
            });
        $paginator = $query->paginate($filter->limit)->withQueryString();
        $branches = BranchData::collect($paginator->getCollection());
        return [
            'branches' => $branches,
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

    /**
     * Bertindak sebagai controller yang menerima request dan mengembalikan
     * response JSON.
     */
    public function asController(FilterPaginationData $filter): JsonResponse
    {
        $result = $this->handle($filter);
        return response()->json($result);
    }
}
