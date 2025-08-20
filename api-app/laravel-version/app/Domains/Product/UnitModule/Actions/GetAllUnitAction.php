<?php

namespace App\Domains\Product\UnitModule\Actions;

use App\Domains\Product\UnitModule\Data\UnitData;
use App\Domains\Product\UnitModule\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;
use Spatie\LaravelData\DataCollection;

class GetAllUnitAction
{
    use AsAction;

    /**
     * @return mixed<int, UnitData>
     */
    public function handle(): mixed
    {
        $units = Unit::where('company_id', Auth::user()->company_id)
            ->get();

        return UnitData::collect($units);
    }

    public function asController(): JsonResponse
    {
        $unit = $this->handle();

        return response()->json([
            'units' => $unit,
        ]);
    }
}
