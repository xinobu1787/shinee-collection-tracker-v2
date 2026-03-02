<?php

namespace App\Http\Controllers;

use App\Http\Requests\RandomItemUploadRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\RandomItem;
use App\Models\UserRandom;
use App\Models\Edition;

class RandomController extends Controller
{
    /**
     * データ表示
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        // URLパラメータ（?edition_id=123）から値を取る。なければ null。
        $editionId = $request->query('edition_id');

        //もしIDがない（まだフィルタで選んでいない）なら、案内画面を出す
        if (!$editionId) {
            return Inertia::render('Random/Index', [
                'edition_info' => null,
                'items' => [],
            ]);
        }

        // 1.形態情報を円盤情報と一緒に取得
        $edition = Edition::with('disc')->findOrFail($editionId);

        // 2.その形態にある全ランダムアイテム
        $masterItems = RandomItem::where('edition_id', $editionId)->get();

        // 3.ユーザーが既に持っている画像データ
        $userItems = UserRandom::where('user_id', $userId)
            ->whereIn('item_id', $masterItems->pluck('id'))
            ->get()
            ->keyBy('item_id');

        // 4.画像があるかどうか判定して処理
        $displayData = $masterItems->map(function ($item) use ($userItems) {
            return [
                'item_id' => $item->id,
                'member_name' => $item->member_name,
                'item_type' => $item->item_type,
                'image_url' => $userItems->has($item->id) ? $userItems[$item->id]->image_url : null,
            ];
        });

        dd($displayData->toArray());

        return Inertia::render('Random/Index', [
            'edition_info' => [
                'artist' => $edition->disc->artist,
                'disc_title' => $edition->disc->title,
                'edition_name' => $edition->display_name,
            ],
            'items' => $displayData,
        ]);
    }

    /**
     * 画像アップロード登録
     */
    public function store(RandomItemUploadRequest $request)
    {
        //バリデーションの値を受け取る
        $validated = $request->validated();

        $userId = Auth::id();

        try {
            // 1.SupabaseのRandomItemストレージフォルダに保存
            $path = $request->file('image')
                ->store('RandomItem', 'supabase');

            // 2.ストレージURLを取得
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('supabase');
            $imageUrl = $disk->url($path);

            // 3.user_randomsに保存
            UserRandom::updateOrCreate(
                [
                    'user_id' => $userId,
                    'item_id' => $validated['item_id']
                ],
                [
                    'image_url' => $imageUrl
                ]
            );

            return back()->with('success', '画像をアップロードしました！');
        } catch (\Exception $e) {
            // 失敗したらログに残す
            Log::error("画像アップロード失敗[User:" . Auth::id() . "] [Item:{$validated['item_id']}]: " . $e->getMessage());

            // もしストレージに保存だけできちゃってたら、ゴミが残らないように消す処理とかも将来的にできるね

            return back()->withErrors(['error' => 'アップロードに失敗しました...。']);
        }
    }
}
