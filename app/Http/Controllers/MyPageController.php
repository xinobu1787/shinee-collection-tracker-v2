<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use App\Services\UserStatusService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyPageController extends Controller
{
    // 統計計算のような重いロジックはServiceクラスへと分離
    public function index(UserStatusService $service)
    {
        $user = Auth::user();
        $wishlist = $this->getWishlist($user->id);

        return Inertia::render('Mypage/Index', [
            'user_info' => [
                'name' => $user->name,
                'icon_url' => $user->icon_url,
            ],
            //統計データをServiceクラスから取得
            'status' => $service->getStatus($user->id),
            //ウィッシュリストを専用メソッドで取得
            'wishlist' => $wishlist,
        ]);
    }

    // ウィッシュリスト取得
    // whereHas を使い、userStatus テーブルのフラグが立っている Edition のみを抽出
    private function getWishlist($userId)
    {
        return Edition::whereHas('userStatus', function ($q) use ($userId) {
            $q->where('user_id', $userId)
                ->where('is_wishlist', true);
        })->with('disc')->get();
    }
}
