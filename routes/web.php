<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TrackerController;
use App\Http\Controllers\MyPageController;
use App\Http\Controllers\RandomController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';


//トラッカーページ・データ表示
Route::get('/tracker', [TrackerController::class, 'index'])
    ->name('tracker.index');

//トラッカーページ・フラグ更新
Route::patch('/tracker', [TrackerController::class, 'updateStatus'])
    ->middleware(['auth'])
    ->name('tracker.update');

//マイページ・データ表示
Route::get('/mypage', [MyPageController::class, 'index'])
    ->middleware(['auth'])
    ->name('mypage');

//ランダム管理ページ・データ表示
Route::get('/random', [RandomController::class, 'index'])
    ->middleware(['auth'])
    ->name('random.index');

//ランダム管理ページ・データ登録
Route::post('/random', [RandomController::class, 'store'])
    ->middleware(['auth'])
    ->name('random.store');

//ランダム管理ページ・データ更新
Route::patch('/random/{id}', [RandomController::class, 'updateStatus'])
    ->middleware(['auth'])
    ->name('random.update');