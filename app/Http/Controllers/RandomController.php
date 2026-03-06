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
use App\Models\Disc;

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
            $rawUrl = $disk->url($path);
            $imageUrl = str_replace('/s3/', '/object/public/', $rawUrl);

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

    /**
     * 開発用（IndexTruthを表示）
     */
    public function dev(Request $request)
    {
        $userId = Auth::id();
        $artist = $request->query('artist');
        $discId = $request->query('disc_id');
        $editionId = $request->query('edition_id');
        $type = $request->query('type');

        // 1. Eager Loadingでリレーション先をまとめて取得
        $itemQuery = RandomItem::with(['edition.disc']);

        // 2. 形態(Edition)での絞り込み（連動）
        if ($editionId) {
            $itemQuery->where('edition_id', $editionId);
        }

        // 3. アイテム種別(Type)での絞り込み（同マスタ内）
        if ($request->filled('type')) {
            $itemQuery->where('item_type', 'LIKE', '%' . $type . '%');
        }

        $masterItems = $itemQuery->get();

        // 4. ユーザー所持情報の取得
        $userItems = UserRandom::where('user_id', $userId)
            ->whereIn('item_id', $masterItems->pluck('id'))
            ->get()
            ->keyBy('item_id');

        if (!$editionId) {
            // 開発中でも、IDがないときはIndexTruth（の空状態）を出す
            return Inertia::render('Random/IndexTruth', [
                'edition_info' => null,
                'items' => [],
            ]);
        }

        // 5. フロントに渡すデータの組み立て
        $displayData = $masterItems->map(function ($item) use ($userItems) {
            return [
                'item_id' => $item->id,
                'member_name' => $item->member_name,
                'item_type' => $item->item_type,
                // ここでリレーションを辿って「出自」をセット！
                'parent_info' => [
                    'artist' => $item->edition->disc->artist,
                    'disc_title' => $item->edition->disc->title,
                    'edition_name' => $item->edition->display_name,
                ],
                'image_url' => $userItems->has($item->id) ? $userItems[$item->id]->image_url : null,
            ];
        });

        // 開発中は dd() で中身を確認しながら進められるね！
        // dd($displayData->toArray());

        // 6. 看板（edition_info）の作成
        // $editionIdがあればその形態の情報を、なければ「全件表示」用にする
        $editionInfo = null;
        if ($editionId) {
            $edition = Edition::with('disc')->findOrFail($editionId);
            $editionInfo = [
                'artist' => $edition->disc->artist,
                'disc_title' => $edition->disc->title,
                'edition_name' => $edition->display_name,
            ];
        }

        return Inertia::render('Random/IndexTruth', [
            'edition_info' => $editionInfo,
            'items' => $displayData,
            'selected_type' => $type,

            'artists' => Disc::select('artist')->distinct()->pluck('artist'), // 重複なしの全アーティスト
            'discs'   => Disc::when($artist, fn($q) => $q->where('artist', $artist))->get(), // アーティストで絞った円盤
            'editions' => Edition::when($discId, fn($q) => $q->where('disc_id', $discId))->get(), // 円盤で絞った形態
        ]);
    }
}
