<?php

namespace App\Domains\Product\UnitModule\Actions;

use App\Domains\Product\UnitModule\Data\CreateUnitData;
use App\Domains\Product\UnitModule\Data\UnitData;
use App\Domains\Product\UnitModule\Models\Unit;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateUnitAction
{
    use AsAction;

    public function handle(CreateUnitData $createUnitData): UnitData
    {
        return UnitData::from(Unit::create([
            'name' => $createUnitData->name,
            'abbreviation' => $createUnitData->abbreviation,
        ]));
    }

    public function asController(CreateUnitData $createUnitData): JsonResponse
    {
        $unit = $this->handle($createUnitData);

        return response()->json([
            'unit' => $unit,
        ]);
    }
}
