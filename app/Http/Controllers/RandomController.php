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
        $member = $request->query('member');


        // --- ここから追加：連動の整合性チェック ---

        // 1. 円盤が現在のアーティストに属しているかチェック
        if ($artist && $discId) {
            $exists = Disc::where('artist', $artist)->where('id', $discId)->exists();
            if (!$exists) {
                $discId = null;    // 矛盾してたら円盤をリセット
                $editionId = null; // 円盤が消えれば形態も消す
            }
        }

        // 2. 形態が現在の円盤に属しているかチェック
        if ($discId && $editionId) {
            $exists = Edition::where('disc_id', $discId)->where('id', $editionId)->exists();
            if (!$exists) {
                $editionId = null; // 矛盾してたら形態をリセット
            }
        }

        // --- チェックここまで ---



        // 1. Eager Loadingでリレーション先をまとめて取得
        $itemQuery = RandomItem::with(['edition.disc']);

        // 2. 段階的な絞り込みロジック
        if ($editionId) {
            // 【優先1】形態まで選ばれていたら、その形態で絞り込む
            $itemQuery->where('edition_id', $editionId);
        } elseif ($discId) {
            // 【優先2】形態はないけど円盤があるなら、その円盤に紐づく全形態のアイテムを出す
            $itemQuery->whereHas('edition', function ($q) use ($discId) {
                $q->where('disc_id', $discId);
            });
        } elseif ($artist) {
            // 【優先3】アーティストだけなら、そのアーティストの全アイテムを出す
            $itemQuery->whereHas('edition.disc', function ($q) use ($artist) {
                $q->where('artist', $artist);
            });
        } else {
            // 【初期状態】何も選ばれていない時は「非表示」にしたい場合
            // 存在しないIDを指定するなどして、空の結果を返すようにする
            $itemQuery->where('id', 0);
        }

        // 3. アイテム種別・メンバー別での絞り込み（同マスタ内）
        if ($member) {
            $itemQuery->where('member_name', $member);
        }

        $availableTypes = [];
        if ($artist) {
            // type で絞り込む前のクエリから、今選んでいる範囲の全 type を取得
            $availableTypes = (clone $itemQuery)->pluck('item_type')->unique()->values()->toArray();
        }

        if ($request->filled('type')) {
            $itemQuery->where('item_type', 'LIKE', '%' . $type . '%');
        }

        $masterItems = $itemQuery->get();

        // 4. ユーザー所持情報の取得
        $userItems = UserRandom::where('user_id', $userId)
            ->whereIn('item_id', $masterItems->pluck('id'))
            ->get()
            ->keyBy('item_id');

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
            'members' => $member,
            'selected_type' => $type,
            'available_types' => $availableTypes,
            'selected_artist' => $artist, // フロント側でセレクトボックスに bind するために渡すと便利！
            'selected_disc'   => $discId,
            'selected_edition' => $editionId,

            'artists' => Disc::select('artist')->distinct()->pluck('artist'), // 重複なしの全アーティスト
            // $artistがない時は空配列を返すようにして、絞り込みを強制する
            'discs'   => $artist
                ? Disc::where('artist', $artist)->get()
                : [],

            // $discIdがない時は空配列を返す
            'editions' => $discId
                ? Edition::where('disc_id', $discId)->get()
                : [],

        ]);
    }
}
