<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Disc;
use App\Models\UserStatus;
use Inertia\Inertia;

class TrackerController extends Controller
{
    public function index()
    {
        // データ取得してInertiaに渡す
        $discs = Disc::latestOrder() -> with('editions.userStatus')
                                     -> get();

        return Inertia::render('Tracker/Index', [
            'discs' => $discs,
        ]);
    }

    public function updateStatus(Request $request)
    {
        //ゲストなら更新させないガード
        if (Auth::guest()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        //ログイン中のユーザーIDと送られてきた形態IDでレコードを探す
        //なければ新しく作る、あればフラグを更新する
        UserStatus::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'edition_id' => $request->edition_id
            ],
            [
                'is_purchased' => $request->is_purchased,
                'is_wishlist' => $request->is_wishlist
            ]
        );

        return response()->json(['message' => 'Status updated successfully']);
    }
}
