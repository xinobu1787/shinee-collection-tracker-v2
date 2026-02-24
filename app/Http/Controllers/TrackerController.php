<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStatusUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Disc;
use App\Models\Edition;
use App\Models\UserStatus;
use Inertia\Inertia;

class TrackerController extends Controller
{
    public function index()
    {
        // データ取得してInertiaに渡す
        $discs = Disc::latestOrder()->with('editions.userStatus')
            ->get();

        dd($discs);

        return Inertia::render('Tracker/Index', [
            'discs' => $discs,
        ]);
    }

    public function updateStatus(UserStatusUpdateRequest $request)
    {
        //ゲストなら更新させないガード
        if (Auth::guest()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        //バリデーション済のデータを取得
        $validated = $request->validated();

        //ログイン中のユーザーIDと送られてきた形態IDでレコードを探す
        //なければ新しく作る、あればフラグを更新する
        try {
            UserStatus::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'edition_id' => $validated['edition_id']
                ],
                [
                    'is_purchased' => $validated['is_purchased'] ?? false,
                    'is_wishlist' => $validated['is_wishlist'] ?? false
                ]
            );

            return back()->with('success', 'フラグを更新しました！');

        } catch (\Exception $e) {
            // ★ ここでエラーをキャッチ！
            // ログにエラー内容を記録（あとで storage/logs/laravel.log を見れば原因がわかる）
            Log::error('フラグ更新失敗: ' . $e->getMessage());

            // ユーザーには「失敗しちゃった」と伝える
            return back()->withErrors(['error' => '更新に失敗しました。時間をおいて試してください。']);
        }
    }
}
