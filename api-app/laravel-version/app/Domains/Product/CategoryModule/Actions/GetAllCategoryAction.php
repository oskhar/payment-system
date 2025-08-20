<?php

namespace App\Domains\Product\CategoryModule\Actions;

use App\Domains\Product\CategoryModule\Data\CategoryData;
use App\Domains\Product\CategoryModule\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;
use Spatie\LaravelData\DataCollection;

class GetAllCategoryAction
{
    use AsAction;

    public function handle(): mixed
    {
        $categories = Category::where('company_id', Auth::user()->company_id)
            ->get();

        return CategoryData::collect($categories);
    }

    public function asController(): JsonResponse
    {
        $category = $this->handle();

        return response()->json([
            'categories' => $category,
        ]);
    }
}
