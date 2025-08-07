<?php

namespace App\Domains\Inventory\BranchModule\Actions;

use App\Domains\Inventory\BranchModule\Data\BranchData;
use App\Domains\Inventory\BranchModule\Data\CreateBranchData;
use App\Domains\Inventory\BranchModule\Models\Branch;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateBranchAction
{
    use AsAction;

    public function handle(CreateBranchData $createBranchData): BranchData
    {
        return BranchData::from(Branch::create([
            'name' => $createBranchData->name,
            'address' => $createBranchData->address,
        ]));
    }

    public function asController(CreateBranchData $createBranchData): JsonResponse
    {
        $branch = $this->handle($createBranchData);

        return response()->json([
            'branch' => $branch,
        ]);
    }
}
