import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import UserNav from '@/Components/UserNav';
import RandomRefine from '@/Components/RandomRefine';
import InputError from '@/Components/Breeze/InputError';
import InputSuccess from '@/Components/InputSuccess';


export default function Index({ auth }) {
  return (
    <div>
      <Head title="ランダム管理(真) - SHINee Collection Tracker" />

      {/* ヘッダー */}
      <Header title="Random Collection Log" />

      {/* ユーザーナビ */}
      <UserNav auth={auth} />

      <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">



      </main>
      <Footer />
    </div>
  );
}