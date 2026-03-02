import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Index({ auth }) {
  return (
    <div>
      <Head title="問い合わせ - SHINee Collection Tracker" />

                {/* ヘッダー・コンポーネントに置き換え */}
      <Header title="Help & Support" />

      <main></main>
      <Footer />
    </div>
  );
}