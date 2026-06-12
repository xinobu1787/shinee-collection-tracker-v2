<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Disc;
use App\Models\Edition;
use App\Models\RandomItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request)
    {

        $tab = $request->query('tab', 'discs');

        $data = match ($tab) {
            'discs' => Disc::with('editions')->get(),
            'editions' => Edition::with('disc')->get(),
            'random_items' => RandomItem::with(['disc', 'edition'])->get(),
            'users' => User::all(),
            'contacts' => Contact::all(),
            default => [],     // 想定外の値が入ってエラーになるのを防ぐため
        };

        // 特定ユーザーを選択するとuser_statusとuser_randomsのデータを表示する
        $selectedUserId = $request->query('user_id');
        $userDetail = null;

        if ($tab === 'users' && $selectedUserId) {
            $userDetail = User::with(['userStatuses', 'userRandoms'])
                ->find($selectedUserId);
        }

        return Inertia::render('Admin/Index', [
            'selectTab' => $tab,
            'masterData' => $data,
            'userDetail' => $userDetail,
        ]);
    }

    public function create(Request $request)
    {
        // 既存の円盤リスト(形態のみ追加等の場合の選択肢)
        $discs = Disc::select('id', 'title')
            ->orderBy('release_date', 'desc')
            ->get();

        // 既存の形態リスト
        $editions = Edition::select('id', 'display_name', 'disc_id')->get();

        // 閲覧ページから特定の円盤・形態への追加ボタンが押された場合
        $selectedDiscId = $request->query('disc_id');
        $selectedEditionId = $request->query('edition_id');

        // 新規登録にするかどうかの判定
        $mode = 'full_new';
        if ($selectedEditionId) {
            $mode = 'add_item';
        } elseif ($selectedDiscId) {
            $mode = 'add_edition';
        }

        // セレクトボックス用
        $category = Disc::distinct()->pluck('category');
        $country = Disc::distinct()->pluck('country');
        $artist = Disc::distinct()->pluck('artist');
        $currency = Edition::distinct()->pluck('currency');
        $memberName = RandomItem::distinct()->pluck('member_name');

        return Inertia::render('Admin/Create', [
            'discs' => $discs,
            'editions' => $editions,
            'selectedDiscId' => $selectedDiscId,
            'selectedEditionId' => $selectedEditionId,
            'mode' => $mode,
            'masterDate' => [
                'category' => $category,
                'country' => $country,
                'artist' => $artist,
                'currency' => $currency,
                'member_name' => $memberName,
            ],
        ]);
    }

    public function store(Request $request)
    {
        try {
            //失敗した時になかったことにするトランザクション処理
            DB::transaction(function () use ($request) {
                // 1. 円盤を保存
                $disc = Disc::create([
                    'code' => $request->disc['code'],
                    'artist' => $request->disc['artist'],
                    'title' => $request->disc['title'],
                    'title_sub' => $request->disc['title_sub'],
                    'category' => $request->disc['category'],
                    'country' => $request->disc['country'],
                    'release_date' => $request->disc['release_date']
                ]);

                // 2. 形態をループで回して保存
                if ($request->has('editions')) {
                    foreach ($request->editions as $editionData) {
                        if (!empty($editionData['name'])) {
                            $edition = $disc->editions()->create([
                                'code' => $editionData['code'],
                                'name' => $editionData['name'],
                                'display_name' => $editionData['display_name'],
                                'price' => $editionData['price'],
                                'currency' => $editionData['currency'],
                                'tracklist' => $editionData['tracklist'],
                                'benefit' => $editionData['benefit'],
                                'video_content' => $editionData['video_content'],
                                'remarks' => $editionData['remarks'],
                                'sort_id' => $editionData['sort_id'],
                            ]);

                            // ランダムアイテムもループで回して保存
                            if (!empty($editionData['random_items'])) {
                                foreach ($editionData['random_items'] as $itemData) {
                                    if (!empty($itemData['member_name'])) {
                                        $edition->randomItems()->create([
                                            'member_name' => $itemData['member_name'],
                                            'item_type' => $itemData['item_type'],
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return redirect()->route('admin')
                ->with('message', '登録が正常に完了しました。');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => '登録に失敗しました。']);
        }
    }

    public function update()
    {
        //
    }

    public function destroy()
    {
        //
    }
}
