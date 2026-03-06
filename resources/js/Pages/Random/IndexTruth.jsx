import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import UserNav from '@/Components/UserNav';
import RandomRefine from '@/Components/Refine/RandomRefine';
import InputError from '@/Components/Breeze/InputError';
import InputSuccess from '@/Components/InputSuccess';


export default function IndexTruth({
  auth,
  edition_info,
  items,
  artists,
  discs,
  editions,
  selected_type
}) {

  console.log('届いたお宝(items):', items);
  console.log('メニュー(discs):', discs);
  console.log('メニュー(editions):', editions);

  // 2. フィルタリング状態: 
  const [filters, setFilters] = useState({
    member: '',
    selected_type: '',
  });

  return (
    <div>
      <Head title="ランダム管理(真) - SHINee Collection Tracker" />

      {/* ヘッダー */}
      <Header title="Random Collection Log" />

      {/* ユーザーナビ */}
      <UserNav auth={auth} />

      {/* フィルタリング・ソート */}
      <RandomRefine
        artists={artists}
        discs={discs}
        editions={editions}
        selected_type={selected_type}
        filters={filters}
        setFilters={setFilters}
      />

      <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">

        <div className="grid grid-cols-3 gap-4 p-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.item_id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#f0fdf4]">
                <div className="text-[10px] text-gray-400 mb-1">{item.parent_info.edition_name}</div>
                <div className="font-bold text-gray-700">{item.member_name}</div>
                <div className="text-xs text-mint-600 bg-mint-50 inline-block px-2 py-0.5 rounded-full mt-1">
                  {item.item_type}
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