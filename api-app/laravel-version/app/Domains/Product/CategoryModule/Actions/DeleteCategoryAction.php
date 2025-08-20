<?php

namespace App\Domains\Product\CategoryModule\Actions;

use App\Common\Data\IdsData;
use App\Common\Exceptions\UnprocessableEntityException;
use App\Domains\Product\CategoryModule\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;
use Symfony\Component\HttpFoundation\Response;

class DeleteCategoryAction
{
    use AsAction;

    public function handle(IdsData $idsData): void
    {
        $idsToDelete = $idsData->ids;
        $existingCount = Category::where('company_id', Auth::user()->company_id)->whereIn('id', $idsToDelete)->count();

        if ($existingCount !== count($idsToDelete)) {
            $existingIds = Category::whereIn('id', $idsToDelete)->pluck('id')->all();
            $notFoundIds = array_diff($idsToDelete, $existingIds);

            throw new UnprocessableEntityException('One or more categories could not be found.', [
                'ids' => 'The following category IDs do not exist: ' . implode(', ', $notFoundIds)
            ]);
        }

        Category::whereIn('id', $idsToDelete)->delete();
    }

    public function asController(IdsData $idsData): JsonResponse
    {
        $this->handle($idsData);

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
