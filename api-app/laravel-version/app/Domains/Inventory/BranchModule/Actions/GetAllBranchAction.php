<?php

namespace App\Domains\Inventory\BranchModule\Actions;

use App\Domains\Inventory\BranchModule\Data\BranchData;
use App\Domains\Inventory\BranchModule\Models\Branch;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class GetAllBranchAction
{
    use AsAction;

    public function handle(): Collection
    {
        return BranchData::collect(Branch::all());
    }

    public function asController(): JsonResponse
    {
        $branches = $this->handle();

        return response()->json([
            'branches' => $branches,
        ]);
    }
}
