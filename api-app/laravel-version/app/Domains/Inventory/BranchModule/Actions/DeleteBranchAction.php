<?php

namespace App\Domains\Inventory\BranchModule\Actions;

use App\Common\Data\IdsData;
use App\Common\Exceptions\UnprocessableEntityException;
use App\Domains\Inventory\BranchModule\Models\Branch;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;
use Symfony\Component\HttpFoundation\Response;

class DeleteBranchAction
{
    use AsAction;

    public function handle(IdsData $idsData): void
    {
        $idsToDelete = $idsData->ids;
        $existingCount = Branch::whereIn('id', $idsToDelete)->count();

        if ($existingCount !== count($idsToDelete)) {
            $existingIds = Branch::whereIn('id', $idsToDelete)->pluck('id')->all();
            $notFoundIds = array_diff($idsToDelete, $existingIds);

            throw new UnprocessableEntityException('One or more branches could not be found.', [
                'ids' => 'The following branch IDs do not exist: ' . implode(', ', $notFoundIds)
            ]);
        }

        Branch::whereIn('id', $idsToDelete)->delete();
    }

    public function asController(IdsData $idsData): JsonResponse
    {
        $this->handle($idsData);

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
