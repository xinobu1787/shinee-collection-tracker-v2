import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import UserNav from '@/Components/UserNav';

export default function Index({ auth }) {
  return (
    <div>
      <Head title="ランダム管理 - SHINee Collection Tracker" />

                {/* ヘッダー・コンポーネントに置き換え */}
      <Header title="Random Collection Log" />

      {/* ユーザーナビ */}
      <UserNav auth={auth} />

      <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">

        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
          <div className="bg-white border-[1px] border-[var(--member-color)] rounded-[2rem] p-10 shadow-[var(--card-shadow)]">
            <span className="text-4xl mb-4 block">🌱</span>
            <h2 className="text-xl font-bold text-[#555] mb-2 flex justify-center">
              {"Coming Soon...".split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: '1s'
                  }}
                >
                  {/* 空白が詰まらないように、スペースの時は特殊な空白文字を入れる工夫 */}
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
            <p className="text-sm text-gray-500">
              このページは現在、心を込めて準備中です。<br />
              アップデートを楽しみにお待ちください！
            </p>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}