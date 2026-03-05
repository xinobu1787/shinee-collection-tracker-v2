import React from 'react';
import './Mypage.css';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import UserInfoCard from '@/Components/UserInfoCard';
import BaseCard from '@/Components/BaseCard';
import UserNav from '@/Components/UserNav';

export default function Index({ auth, status, wishlist }) {

  // メンバー名と顔文字の対応表
  const memberConfig = [
    { name: 'Onew', emoji: '⌒∇⌒', key: 'Onew', className: 'circle-onew' },
    { name: 'Jonghyun', emoji: 'ㅎㅅㅎ', key: 'Jonghyun', className: 'circle-jonghyun' },
    { name: 'Key', emoji: "'ㅂ'", key: 'Key', className: 'circle-key' },
    { name: 'Minho', emoji: 'ㅍ_ㅍ', key: 'Minho', className: 'circle-minho' },
    { name: 'Taemin', emoji: 'δvδ', key: 'Taemin', className: 'circle-taemin' },
  ];

  // バッジ表示用のマスタデータ（アイコン名や名前を定義）
  const badgeMaster = [
    { id: 'hello', name: 'Hello', icon: 'waving_hand' },
    { id: 'odd', name: 'Odd', icon: 'wb_sunny' },
    { id: 'poet', name: 'Poet', icon: 'menu_book' },
    // 今後ここに追加するだけでOK
  ];

  return (
    <div>
      <Head title="マイページ - SHINee Collection Tracker" />

      {/* ヘッダー */}
      <Header title="My Collection Status" />

      {/* ユーザーナビ */}
      <UserNav auth={auth} />

      <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">

        {/* ユーザー情報 */}
        <UserInfoCard user={auth.user} />

        {/* 進捗バー */}
        <BaseCard title="Collection Progress">

          {/* トータル進捗バー */}
          <div className="relative w-full h-20 bg-gray-100 rounded-[2rem] overflow-hidden shadow-inner">
            {/* ゲージ部分 */}
            <div
              className="h-full bg-[#81d4af] flex items-center justify-center transition-all duration-1000 ease-out"
              style={{ width: `${status.total}%` }}
            >
              <span className="text-white font-bold text-lg">
                {status.total}%
              </span>
            </div>
          </div>

          {/* メンバー別円形進捗バー */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 my-8">
            {memberConfig.map((member) => (
              <div key={member.key} className="flex flex-col items-center w-[calc(33.33%-1rem)] min-w-[90px] md:flex-1">
                {/* Java版のCSSクラスをそのまま適用 */}
                <div
                  className={`circle-progress ${member.className} shadow-sm`}
                  style={{ '--percent': `${status[member.key]}%` }}
                >
                  <span className="kaomoji absolute inset-0 flex items-center justify-center z-10">{member.emoji}</span>

                  <span className="absolute bottom-6 w-full text-center text-[11px] font-black text-[#81d4af] z-10 tracking-tighter">
                    {status[member.key]}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 国別進捗バー：横に2つ並べる */}
          <div className="flex flex-row justify-between gap-4 mt-4 mb-8">
            {[
              { label: 'JP', key: 'jp' },
              { label: 'KR', key: 'kr' }
            ].map((country) => (
              /* 2. reg-item (各国の枠) */
              <div key={country.key} className="flex-1 flex items-center min-h-[3rem] relative">

                {/* 3. reg-bar-bg (バーの背景) */}
                <div className="flex-1 h-[2.8rem] bg-[#f0f0f0] rounded-[1.2rem] overflow-hidden flex shadow-inner">

                  {/* 4. reg-bar-fill (伸びるバー本体) */}
                  <div
                    className="h-full bg-[#81d4af] flex items-center justify-between px-4 transition-all duration-1000 ease-in-out min-w-[5rem]"
                    style={{ width: `${status[country.key]}%` }}
                  >
                    {/* 5. reg-flag (バーの中のラベル) */}
                    <span className="text-white text-sm font-black italic tracking-wider flex-shrink-0 leading-none">
                      {country.label}
                    </span>

                    {/* 6. reg-percent (バーの中の数字) */}
                    <span className="text-white text-[0.75rem] font-bold drop-shadow-sm flex-shrink-0 leading-none">
                      {status[country.key]}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BaseCard>

        {/* バッジ機能セクション */}
        <BaseCard title="Collection Badges">

          {/* バッジを並べるコンテナ (badge-grid) */}
          <div className="flex flex-wrap justify-center gap-6 p-4 w-full">
            {badgeMaster.map((m) => {
              // サーバーからの $status['badges'] の中身を参照して判定！
              const isUnlocked = status.badges?.[m.id] || false;

              return (
                <div
                  key={m.id}
                  className={`
                  flex flex-col items-center gap-2 flex-none w-[4.5rem] transition-all duration-500
                  ${isUnlocked
                      ? 'grayscale-0 opacity-100 text-[#81d4af] animate-badge-pop'
                      : 'grayscale opacity-20 text-gray-400'}
                  `}
                >
                  {/* アイコン部分の枠 (badge-icon-wrapper) */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100">
                    <span className="material-symbols-outlined text-3xl">
                      {m.icon}
                    </span>
                  </div>

                  {/* バッジ名 (badge-name) */}
                  <span className="text-[10px] font-black text-center leading-tight tracking-tighter">
                    {m.name}
                  </span>
                </div>
              );
            })}
          </div>
        </BaseCard>

        {/* ウィッシュリストセクション */}
        <BaseCard title="Wishlist">

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.length > 0 ? (
              wishlist.map((item) => (
                /* wish-item: ホバーで上に浮き上がるアニメーション付き */
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-[1rem] border border-[#e0f7f4] shadow-[0_0.2rem_0.5rem_rgba(0,0,0,0.05)] transition-transform duration-200 ease-out hover:-translate-y-[3px] flex flex-col gap-1"
                >
                  <div className="wish-item-content">
                    {/* artist-name: SHINeeカラーの小さな文字 */}
                    <span className="block text-[0.7rem] text-[#00c7b1] font-bold mb-[0.2rem]">
                      {item.disc?.artist || 'SHINee'}
                    </span>

                    {/* edition-name-mp: タイトル部分 */}
                    <span className="block text-[0.9rem] font-semibold text-[#333] line-height-[1.2]">
                      {item.disc?.title || 'Unknown Title'}
                    </span>

                    {/* edition-tag: グレーの小さなタグ */}
                    <span className="inline-block mt-2 text-[0.7rem] bg-[#f0f0f0] px-2 py-px rounded-[0.5rem] text-[#666]">
                      {item.display_name || '通常盤'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              /* empty-msg: リストが空の時の表示 */
              <div className="col-span-full text-center py-8 text-[#aaa] font-bold">
                まだリストは空です 💎
              </div>
            )}
          </div>
        </BaseCard>
      </main>

      <Footer />
    </div>
  );
}