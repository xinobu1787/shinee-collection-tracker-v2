import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import UserNav from '@/Components/UserNav';
import RandomRefine from '@/Components/Refine/RandomRefine';
import InputError from '@/Components/Breeze/InputError';


export default function Index({
  auth, items, members, artists,
  discs, editions, selected_artist,
  selected_disc, selected_edition,
  selected_type, available_types, errors
}) {

  // フィルタリング状態:
  const [filters, setFilters] = useState({
    member: members || '',
    selected_type: selected_type || '',
  });

  const [isUploading, setIsUploading] = useState(false);

  // 1. useForm を使わず、router を直接使って身軽に飛ばす
  const handleUpload = (e, itemId) => {
    const file = e.target.files[0];
    if (!file) return;

    // 2. 送信処理（FormData形式で飛ばす）
    router.post('/random', {
      image: file,
      item_id: itemId, // これが重要！どのアイテムの画像か伝える
    }, {
      forceFormData: true,  // 画像アップロードには必須
      preserveState: true,
      preserveScroll: true, // 1082件あるから、スクロール位置をキープ
      only: ['items'],
      // 送信開始時に true にする
      onBefore: () => setIsUploading(true),
      // 成功しても失敗しても、終わったら false に戻す
      onFinish: () => setIsUploading(false),
    });
  };

  return (
    <div>
      <Head title="ランダム管理 - SHINee Collection Tracker" />

      {/* ヘッダー */}
      <Header title="Random Collection Log" />

      {/* ユーザーナビ */}
      <UserNav auth={auth} />

      {/* 絞り込み・フィルタリング */}
      <RandomRefine
        artists={artists}
        selected_artist={selected_artist}
        discs={discs}
        selected_disc={selected_disc}
        editions={editions}
        selected_edition={selected_edition}
        selected_type={selected_type}
        available_types={available_types}
        filters={filters}
        setFilters={setFilters}
      />

      <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 max-w-[1200px] mx-auto">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={item.item_id} className="bg-white rounded-2xl shadow-sm border border-[var(--base-color)] border-solid overflow-hidden flex flex-col">

                {/* 上部：画像エリア（クリックでアップロード） */}
                <label className="relative w-full cursor-pointer group aspect-[3/4] block">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, item.item_id)}
                  />

                  {item.image_url ? (
                    /* 画像がある時 */
                    <img
                      src={item.image_url}
                      alt={item.member_name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    /* 画像がない時：中央に大きく「＋」 */
                    <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:bg-gray-100 transition-colors">
                      {isUploading ? (
                        <span className="animate-spin material-symbols-outlined text-4xl">sync</span>
                      ) : (
                        <span className="material-symbols-outlined text-4xl">add</span>
                      )}
                    </div>
                  )}

                  {/* 画像があっても、ホバーした時に出す薄いレイヤー */}
                  {item.image_url && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 text-3xl">cached</span>
                    </div>
                  )}
                </label>

                {/* 下部：テキスト部分 */}
                <div className="p-3 bg-white border-t border-gray-100">
                  <div className="text-[1rem] text-gray-400 truncate leading-tight">
                    {item.parent_info.edition_name}
                  </div>
                  <div className="font-bold text-gray-700 text-[1.2rem] truncate">
                    {item.member_name}
                  </div>
                  <div className="text-[1.2rem] block px-2 py-0.5 rounded-full mt-1 text-right">
                    {item.item_type}
                  </div>

                  {/* 特定のアイテムでエラーが出た時だけ表示されるように制御 */}
                  <InputError message={errors[`items.${index}.image`] || errors.image} className="mt-2 !text-[10px] leading-tight" />
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-gray-400">
              お宝が見つかりませんでした…… 💎
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}