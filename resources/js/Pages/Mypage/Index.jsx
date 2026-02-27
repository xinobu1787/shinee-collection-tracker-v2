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
    { name: 'Onew', emoji: '⌒∇⌒', key: 'Onew' },
    { name: 'Jonghyun', emoji: 'ㅎㅅㅎ', key: 'Jonghyun' },
    { name: 'Key', emoji: "'ㅂ'", key: 'Key' },
    { name: 'Minho', emoji: 'ㅍ_ㅍ', key: 'Minho' },
    { name: 'Taemin', emoji: 'δvδ', key: 'Taemin' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f9f4]"> {/* 背景をJava版に近い薄い緑に */}
      <Head title="マイページ - SHINee Collection Tracker" />

      {/* ヘッダー・コンポーネントに置き換え */}
      <Header title="My Collection Status" />

      <main>
        <UserInfoCard user={auth.user} />

        {/* ここに進捗バー */}

        {/* ここにバッジ機能セクション */}

        {/* ここにウィッシュリストセクション */}
      </main>

      <Footer />
    </div>
  );
}