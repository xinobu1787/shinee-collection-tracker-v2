<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use App\Models\RandomItem;
use App\Models\UserRandom;
use App\Services\UserStatusService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyPageController extends Controller
{
    // 統計計算のような重いロジックはServiceクラスへと分離
    public function index(Request $request, UserStatusService $service)
    {
        $user = Auth::user();

        // 1. ウィッシュリスト取得
        $wishlist = $this->getWishlist($user->id);

        // 2. My Pick Collection 取得 (新機能)
        // リクエストからメンバー名の配列（['Taemin', 'Onew']など）を受け取る
        $selectedMembers = $request->input('members', []);
        $mypickItems = $this->getMypick($user->id, $selectedMembers);

        return Inertia::render('Mypage/Index', [
            'user_info' => [
                'name' => $user->name,
                'icon_url' => $user->icon_url,
            ],
            //統計データをServiceクラスから取得
            'status' => $service->getStatus($user->id),
            //ウィッシュリストを専用メソッドで取得
            'wishlist' => $wishlist,
            'mypick_items' => $mypickItems,
            'selected_members' => $selectedMembers,
        ]);
    }

    /**
     * My Pick Collection 取得ロジック
     * 選ばれたメンバーの全アイテムを、所持画像と共に取得する
     */
    private function getMypick($userId, $selectedMembers)
    {
        // メンバーが選ばれていない場合は、ラフ画の通り「空」で返す
        if (empty($selectedMembers)) {
            return [];
        }

        // 1. 選ばれたメンバーのマスターデータを取得
        // 全円盤を横断するため、Eager Loading で円盤情報まで繋ぐ
        $masterItems = RandomItem::with(['edition.disc'])
            ->whereIn('member_name', $selectedMembers)
            // 発売日順に並べるために join してソート
            ->join('editions', 'random_items.edition_id', '=', 'editions.id')
            ->join('discs', 'editions.disc_id', '=', 'discs.id')
            ->orderBy('discs.release_date', 'asc')
            ->select('random_items.*') // ID重複を避ける
            ->get();

        // 2. ユーザーがそのアイテムの画像を持っているか取得
        $userItems = UserRandom::where('user_id', $userId)
            ->whereIn('random_item_id', $masterItems->pluck('id'))
            ->get()
            ->keyBy('random_item_id');

        // 3. ランダム管理ページのロジックを活用し、フロントが使いやすい形に整形
        return $masterItems->map(function ($item) use ($userItems) {
            return [
                'item_id' => $item->id,
                'member_name' => $item->member_name,
                'item_type' => $item->item_type,
                // ラフ画にある「円盤名」「形態名」をセット
                'parent_info' => [
                    'artist' => $item->edition->disc->artist,
                    'disc_title' => $item->edition->disc->title,
                    'edition_name' => $item->edition->display_name,
                ],
                // 画像URLがあればセット（なければ null → フロントでグレー表示）
                'image_url' => $userItems->has($item->id) ? $userItems[$item->id]->image_url : null,
            ];
        });
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
