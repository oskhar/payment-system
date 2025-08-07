<?php

namespace App\Domains\Product\UnitModule\Actions;

use App\Domains\Product\UnitModule\Data\UnitData;
use App\Domains\Product\UnitModule\Models\Unit;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class GetAllUnitAction
{
    use AsAction;

    /**
     * @return DataCollection<UnitData>
     */
    public function handle(): Collection
    {
        return UnitData::collect(
            Unit::all()
        );
    }

    public function asController(): JsonResponse
    {
        $unit = $this->handle();

        return response()->json([
            'units' => $unit,
        ]);
    }
}
