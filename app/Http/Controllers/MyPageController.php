<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use App\Services\UserStatusService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyPageController extends Controller
{
    //フロントへデータを渡す
    public function index(UserStatusService $service)
    {
        $user = Auth::user();

        return Inertia::render('MyPage/Index', [
            'user_info' => [
                'name' => $user->name,
                'icon_url' => $user->icon_url,
            ],
            //統計データをServiceクラスから取得
            'status' => $service -> getStatus($user -> id),
            //ウィッシュリストを専用メソッドで取得
            'wishlist' => $this -> getWishlist($user -> id),
        ]);
    }

    /**
     * ウィッシュリスト取得
     */
    private function getWishlist($userId)
    {
        return Edition::whereHas('userStatus', function($q) use ($userId) {
            $q -> where('user_id', $userId)
               -> where('is_wishlist', true);
        }) -> with('disc') -> get();
    }
}
