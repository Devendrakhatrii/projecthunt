<?php

namespace App\Http\Controllers;

use App\ApiResponse;
use App\LogResponse;
use App\HasTimeAgo;

abstract class Controller
{
    use ApiResponse, LogResponse, HasTimeAgo;
}
