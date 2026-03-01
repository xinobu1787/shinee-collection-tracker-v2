import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import UserInfoCard from '@/Components/UserInfoCard';

export default function Index({ auth, status, wishlist }) {

  console.log("届いたステータス：", status);
  console.log("届いたウィッシュリスト：", wishlist);

  // メンバー名と顔文字の対応表
  const memberConfig = [
    { name: 'Onew', emoji: '⌒∇⌒', key: 'Onew', className: 'circle-onew' },
    { name: 'Jonghyun', emoji: 'ㅎㅅㅎ', key: 'Jonghyun', className: 'circle-jonghyun' },
    { name: 'Key', emoji: "'ㅂ'", key: 'Key', className: 'circle-key' },
    { name: 'Minho', emoji: 'ㅍ_ㅍ', key: 'Minho', className: 'circle-minho' },
    { name: 'Taemin', emoji: 'δvδ', key: 'Taemin', className: 'circle-taemin' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)]"> {/* 背景をJava版に近い薄い緑に */}
      <Head title="マイページ - SHINee Collection Tracker" />

      {/* ヘッダー・コンポーネントに置き換え */}
      <Header title="My Collection Status" />

      <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">
        <UserInfoCard user={auth.user} />

        {/* 進捗バー */}
        <div className="mx-4 my-4 p-6 bg-white rounded-[2rem] shadow-sm border border-[#e8f5e9]">
          <h2 className="text-[#81d4af] font-bold text-xl mb-4">Collection Progress</h2>

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
        </div>

        {/* バッジ機能セクション */}
        <section className="mx-4 my-4 p-6 bg-white rounded-[2rem] shadow-sm border border-[#e8f5e9]">
            <h2 className="text-[#81d4af] font-bold text-xl mb-4">Collection Badges</h2>
        </section>

        {/* ウィッシュリストセクション */}
        <section className="mx-4 my-4 p-6 bg-white rounded-[2rem] shadow-sm border border-[#e8f5e9]">
            <h2 className="text-[#81d4af] font-bold text-xl mb-4">Wishlist</h2>
        </section>
      </main>

      <Footer />
    </div>
  );
}