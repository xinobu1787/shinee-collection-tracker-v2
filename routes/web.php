<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TrackerController;
use App\Http\Controllers\MyPageController;
use App\Http\Controllers\RandomController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('tracker');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
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

//ランダム管理ページ・データ登録更新
Route::post('/random', [RandomController::class, 'store'])
    ->middleware(['auth'])
    ->name('random.store');

//問い合わせページ・データ表示
Route::get('/contact', [ContactController::class, 'index'])
    ->name('contact.index');

//問い合わせページ・データ送信
Route::post('/contact', [ContactController::class, 'store'])
    ->name('contact.store');

//問い合わせページ・リダイレクト
Route::get('/contact/send', [ContactController::class, 'thanks'])
    ->name('contact.thanks');
