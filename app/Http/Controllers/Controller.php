<?php

namespace App\Http\Controllers;

use App\ApiResponse;
use App\LogResponse;

abstract class Controller
{
    use ApiResponse, LogResponse;
}
