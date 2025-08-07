<?php

namespace App\Domains\Product\CategoryModule\Actions;

use App\Domains\Product\CategoryModule\Data\CategoryData;
use App\Domains\Product\CategoryModule\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class GetAllCategoryAction
{
    use AsAction;

    public function handle(): Collection
    {
        return CategoryData::collect(
            Category::all()
        );
    }

    public function asController(): JsonResponse
    {
        $category = $this->handle();

        return response()->json([
            'categories' => $category,
        ]);
    }
}
