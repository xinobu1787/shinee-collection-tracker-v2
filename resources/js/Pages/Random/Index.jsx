import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Index({ auth }) {
  return (
    <div>
      <Head title="ランダム管理 - SHINee Collection Tracker" />

                {/* ヘッダー・コンポーネントに置き換え */}
      <Header title="Random Collection Log" />

      <main></main>
      <Footer />
    </div>
  );
}