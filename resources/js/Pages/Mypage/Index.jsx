import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Index({ auth }) {
  return (
    <div className="min-h-screen bg-[#f0f9f4]"> {/* 背景をJava版に近い薄い緑に */}
      <Head title="マイページ - SHINee Collection Tracker" />

                {/* ヘッダー・コンポーネントに置き換え */}
      <Header title="My Collection Status" />

      <main></main>
      <Footer />
    </div>
  );
}