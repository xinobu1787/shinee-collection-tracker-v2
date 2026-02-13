<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrackerController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/tracker',
    [TrackerController::class, 'index']
) -> name('tracker.index');