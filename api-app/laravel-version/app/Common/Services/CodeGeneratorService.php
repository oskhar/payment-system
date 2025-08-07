<?php

namespace App\Common\Services;

class CodeGeneratorService
{
    /**
     * Generate a new code based on a prefix and the current data count.
     *
     * @param string $prefix The prefix for the code (e.g., 'TRX-').
     * @param int $countData The current count of existing data, used to determine the next number.
     * @param int $paddingLength The total length of the numeric part, padded with zeros. Default is 4.
     * @return string The newly generated code (e.g., 'TRX-0001').
     */
    public function __invoke(string $prefix, int $countData, int $paddingLength = 4): string
    {
        $nextNumber = $countData + 1;
        $paddedNumber = str_pad($nextNumber, $paddingLength, '0', STR_PAD_LEFT);

        return $prefix . $paddedNumber;
    }
}
