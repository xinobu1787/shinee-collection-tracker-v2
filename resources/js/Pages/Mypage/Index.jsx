import React from 'react';
import './Mypage.css';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import UserInfoCard from '@/Components/UserInfoCard';
import UserNav from '@/Components/UserNav';
import ProgressSection from '@/Components/Section/ProgressSection';
import BadgeSection from '@/Components/Section/BadgeSection';
import WishlistSection from '@/Components/Section/WishlistSection';
import MypickSection from '@/Components/Section/MypickSection';

export default function Index({
  auth, status, wishlist,
  mypick_items, selected_members
}) {

  // メンバー名と顔文字の対応表
  const memberConfig = [
    { name: 'Onew', emoji: '⌒∇⌒', key: 'Onew', className: 'circle-onew' },
    { name: 'Jonghyun', emoji: 'ㅎㅅㅎ', key: 'Jonghyun', className: 'circle-jonghyun' },
    { name: 'Key', emoji: "'ㅂ'", key: 'Key', className: 'circle-key' },
    { name: 'Minho', emoji: 'ㅍ_ㅍ', key: 'Minho', className: 'circle-minho' },
    { name: 'Taemin', emoji: 'δvδ', key: 'Taemin', className: 'circle-taemin' },
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

        {/* 進捗バーセクション */}
        <ProgressSection status={status} memberConfig={memberConfig} />

        {/* バッジ機能セクション */}
        <BadgeSection status={status} />

        {/* ウィッシュリストセクション */}
        <WishlistSection wishlist={wishlist} />

        {/* 推しランダム品セクション */}
        <MypickSection
          items={mypick_items}
          selected={selected_members}
          memberConfig={memberConfig}
        />
      </main>

      <Footer />
    </div>
  );
}