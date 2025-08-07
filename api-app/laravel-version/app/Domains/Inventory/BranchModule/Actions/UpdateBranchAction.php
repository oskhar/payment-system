<?php

namespace App\Domains\Inventory\BranchModule\Actions;

use App\Common\Exceptions\UnprocessableEntityException;
use App\Domains\Inventory\BranchModule\Data\UpdateBranchData;
use App\Domains\Inventory\BranchModule\Models\Branch;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateBranchAction
{
    use AsAction;

    public function handle(?Branch $branch, UpdateBranchData $updateBranchData): void
    {
        if (!$branch)
            throw new UnprocessableEntityException('Branch not found');

        $branch->update([
            'name' => $updateBranchData->name,
            'address' => $updateBranchData->address,
        ]);
    }

    public function asController(?Branch $branch, UpdateBranchData $updateBranchData): JsonResponse
    {
        $this->handle($branch, $updateBranchData);

        return response()->json();
    }
}
