<?php

namespace App\Domains\Product\CategoryModule\Actions;

use App\Domains\Product\CategoryModule\Data\CategoryData;
use App\Domains\Product\CategoryModule\Data\CreateCategoryData;
use App\Domains\Product\CategoryModule\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateCategoryAction
{
    use AsAction;

    public function handle(CreateCategoryData $createCategoryData): CategoryData
    {
        return CategoryData::from(Category::create([
            'company_id' => Auth::user()->company_id,
            'name' => $createCategoryData->name,
        ]));
    }

    public function asController(CreateCategoryData $createCategoryData): JsonResponse
    {
        $category = $this->handle($createCategoryData);

        return response()->json([
            'category' => $category,
        ]);
    }
}
