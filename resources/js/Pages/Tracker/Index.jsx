import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import DiscCard from '@/Components/DiscCard';

export default function Index({ auth, discs }) {
    // コンソールでデータが届いているのは確認済み！
    console.log("届いたデータ:", discs);

    return (
        <div className="min-h-screen bg-[#f0f9f4]"> {/* 背景をJava版に近い薄い緑に */}
            <Head title="SHINee Collection Tracker" />

            {/* ヘッダー・コンポーネントに置き換え */}
            <Header title="SHINee Collection Tracker" />
            
            <main className="max-w-5xl mx-auto px-4 pb-24">
                {/* フィルタボタンの並び（一旦見た目だけ） */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {['All Artist', 'All Country', 'All Category', 'All Status', '新しい順'].map((label) => (
                        <button key={label} className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm hover:bg-gray-50">
                            {label}
                        </button>
                    ))}
                </div>

                {/* 円盤カードのグリッド・コンポーネント置き換え */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discs.map((disc) => (
                        <DiscCard key={disc.id} disc={disc} />
                    ))}
                </div>
            </main>

            {/* ボトムナビゲーション・コンポーネント置き換え */}
            <Footer />
        </div>
    );
}