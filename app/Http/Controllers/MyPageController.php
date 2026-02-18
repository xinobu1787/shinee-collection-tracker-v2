<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use App\Models\UserStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyPageController extends Controller
{
    //フロントへデータを渡す
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('MyPage/Index', [
            'user_info' => [
                'name' => $user->name,
                'icon_url' => $user->icon_url,
            ],
            //統計データを専用メソッドから生成
            'status' => $this -> generateStatus($user -> id),
            //ウィッシュリストを専用メソッドで取得
            'wishlist' => $this -> getWishlist($user -> id),
        ]);
    }

    /**
     * 統計データの集計ロジック
     */
    private function generateStatus($userId)
    {
        //1.全体の進捗率
        $totalCount = \App\Models\Edition::count();
        $ownedCount = \App\Models\UserStatus::where('user_id', $userId)
            ->where('is_purchased', true)
            ->count();

        $status = [
            'total' => $totalCount > 0 ? round(($ownedCount / $totalCount) * 100) : 0,
        ];

        //2.メンバー別の進捗率
        $members = ['Onew', 'Jonghyun', 'Key', 'Minho', 'Taemin'];
        foreach ($members as $name) {
            $status[$name] = $this -> calculateRateByArtist($name, $userId);
        }

        //3.国別の進捗率
        $status['jp'] = $this -> calculateRateByCountry('Japan', $userId);
        $status['kr'] = $this -> calculateRateByCountry('Korea', $userId);

        return $status;
    }

    /**
     * アーティスト別の購入率計算
     */
    private function calculateRateByArtist($artistName, $userId)
    {
        //該当アーティストの全形態数
        $total = Edition::whereHas('disc', function($q) use ($artistName) {
            $q -> where('artist', $artistName);
        }) -> count();

        //ユーザーが所持済の数
        $owned = UserStatus::where('user_id', $userId)
                          -> where('is_purchased', true)
                          -> whereHas('edition.disc', function($q) use ($artistName) {
                                $q -> where('artist', $artistName);
                          }) -> count();

        return $total > 0 ? round(($owned / $total) * 100) : 0;
    }

    /**
     * 国別の購入率計算
     */
    private function calculateRateByCountry($country, $userId)
    {
        //該当国の全形態数
        $total = Edition::whereHas('disc', function ($q) use ($country) {
            $q->where('country', $country);
        })->count();

        //ユーザーが所持済の数
        $owned = UserStatus::where('user_id', $userId)
            ->where('is_purchased', true)
            ->whereHas('edition.disc', function ($q) use ($country) {
                $q->where('country', $country);
            })->count();

        return $total > 0 ? round(($owned / $total) * 100) : 0;
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
