<?php

namespace App\Domains\Inventory\StockModule\Enums;

enum StockTypeEnum: string
{
    case IN = 'in';
    case OUT = 'out';
}
