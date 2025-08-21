<?php

namespace App\Domains\Sales\TransactionModule\Enums;

enum PaymentMethodEnum: string
{
    case DANA = 'dana';
    case BRI = 'bri';
    case BCA = 'bca';
    case MANDIRI = 'mandiri';
    case CASH = 'cash';
}
