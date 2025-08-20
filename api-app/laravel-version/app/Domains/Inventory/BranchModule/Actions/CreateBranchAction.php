<?php

namespace App\Domains\Inventory\BranchModule\Actions;

use App\Domains\Inventory\BranchModule\Data\BranchData;
use App\Domains\Inventory\BranchModule\Data\CreateBranchData;
use App\Domains\Inventory\BranchModule\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateBranchAction
{
    use AsAction;

    public function handle(CreateBranchData $createBranchData): BranchData
    {
        $branchModel = Branch::create([
            'company_id' => Auth::user()->company_id,
            'name' => $createBranchData->name,
            'address' => $createBranchData->address,
        ]);

        return BranchData::from($branchModel->toArray());
    }

    public function asController(CreateBranchData $createBranchData): JsonResponse
    {
        $branch = $this->handle($createBranchData);

        return response()->json([
            'branch' => $branch,
        ]);
    }
}
