import React from 'react';
import { Head } from '@inertiajs/react';

export default function Index({ auth, discs }) {
    // コンソールでデータが届いているのは確認済み！
    console.log("届いたデータ:", discs);

    return (
        <div className="min-h-screen bg-[#f0f9f4]"> {/* 背景をJava版に近い薄い緑に */}
            <Head title="SHINee Collection Tracker" />

            {/* ヘッダー部分：Java版のデザインを再現 */}
            <header className="py-10 text-center">
                <h1 className="text-3xl font-bold text-white drop-shadow-md" 
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    SHINee Collection Tracker
                </h1>
            </header>

            <main className="max-w-5xl mx-auto px-4 pb-24">
                {/* フィルタボタンの並び（一旦見た目だけ） */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {['All Artist', 'All Country', 'All Category', 'All Status', '新しい順'].map((label) => (
                        <button key={label} className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm hover:bg-gray-50">
                            {label}
                        </button>
                    ))}
                </div>

                {/* 円盤カードのグリッド */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discs.map((disc) => (
                        <div 
                            key={disc.id} 
                            className="bg-white p-5 rounded-full shadow-sm flex justify-between items-center border border-white hover:border-green-200 transition-all cursor-pointer group"
                            onClick={() => console.log(`${disc.title} の詳細を表示`)}
                        >
                            <span className="font-bold text-gray-700 ml-6 group-hover:text-green-600">
                                {disc.title}
                            </span>
                            <span className="text-xs text-gray-400 mr-6 italic">
                                {disc.title_sub}
                            </span>
                        </div>
                    ))}
                </div>
            </main>

            {/* ボトムナビゲーション（ここに後でメニューを入れる） */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 py-3 flex justify-around items-center shadow-lg">
                <div className="text-green-500 text-xs flex flex-col items-center">
                    <span className="mb-1 text-xl">💎</span>
                    <span>トラッカー</span>
                </div>
                {/* ログインしていれば「マイページ」、いなければ「ログイン」と出すことも可能 */}
            </nav>
        </div>
    );
}