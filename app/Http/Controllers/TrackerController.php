<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStatusUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Disc;
use App\Models\UserStatus;
use Inertia\Inertia;

class TrackerController extends Controller
{
    public function index()
    {
        // ディスク情報に加え、形態ごとの「ユーザー所持状態」をEager Loadingで一括取得
        // N+1問題を回避し、Spring Boot版にはなかったユーザー別管理を実現
        $discs = Disc::latestOrder()->with('editions.userStatus')
            ->get();

        return Inertia::render('Tracker/Index', [
            'discs' => $discs,
        ]);
    }

    public function updateStatus(UserStatusUpdateRequest $request)
    {
        // 1. セキュリティガード
        // ログイン済みユーザーのみ実行可能にする（Middlewareでも制限しているが、二重の安全策）
        if (Auth::guest()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validated();


        try {
            // 2. データの整合性維持
            // ユーザーIDと形態IDの組み合わせで、既存レコードの更新または新規作成を行う
            UserStatus::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'edition_id' => $validated['edition_id']
                ],
                [
                    'is_purchased' => $validated['is_purchased'],
                    'is_wishlist' => $validated['is_wishlist']
                ]
            );

            // 3. ユーザーへのフィードバック（成功時）
            // Inertiaのフラッシュメッセージとしてフロントエンドに通知
            return back()->with('success', 'フラグを更新しました！');

        } catch (\Exception $e) {
            // 4. エラーハンドリングと可視化
            // ログを残すことで、本番環境でのトラブルシューティングを容易にする
            Log::error('フラグ更新失敗: ' . $e->getMessage());

            // フロントエンドに例外を知らせ、InputErrorコンポーネントで表示させる
            return back()->withErrors(['error' => '更新に失敗しました。時間をおいて試してください。']);
        }
    }
}
