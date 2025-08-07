<?php

namespace App\Common\Cast;

use Spatie\LaravelData\Casts\Cast;
use Spatie\LaravelData\Support\Creation\CreationContext;
use Spatie\LaravelData\Support\DataProperty;

class ArrayOfIntsCast implements Cast
{
    /**
     * Cast a value to an array of integers.
     * Handles comma-separated strings or existing arrays.
     *
     * @param \Spatie\LaravelData\Support\DataProperty $property
     * @param mixed $value The incoming value.
     * @param array $properties The properties of the data object being created.
     * @param \Spatie\LaravelData\Support\Creation\CreationContext $context The context of the creation process.
     * @return mixed
     */
    public function cast(
        DataProperty $property,
        mixed $value,
        array $properties,
        CreationContext $context
    ): mixed {
        // Handle string input (e.g., "1, 2, 3")
        if (is_string($value)) {
            // If the string is empty or just whitespace, return an empty array.
            if (trim($value) === '') {
                return [];
            }
            // Explode the string into an array.
            $value = explode(',', $value);
        }

        // Ensure the value is an array and cast each item to an integer.
        // The `trim()` function handles any extra whitespace around numbers.
        return array_map(
            fn($item) => (int) trim($item),
            (array) $value
        );
    }
}
