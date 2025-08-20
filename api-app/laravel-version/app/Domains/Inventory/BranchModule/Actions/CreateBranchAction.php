<?php

namespace App\Domains\Inventory\BranchModule\Actions;

use App\Domains\Inventory\BranchModule\Data\BranchData;
use App\Domains\Inventory\BranchModule\Data\CreateBranchData;
use App\Domains\Inventory\BranchModule\Models\Branch;
use App\Domains\Sales\UserModule\Data\UserData;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateBranchAction
{
    use AsAction;

    public function handle(CreateBranchData $createBranchData): BranchData
    {
        $branchModel = Branch::create([
            'company_id' => 1,
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
