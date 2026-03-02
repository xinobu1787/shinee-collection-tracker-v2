import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import DiscCard from '@/Components/DiscCard';
import DiscModal from '@/Components/DiscModal/DiscModal';
import RefineBar from '@/Components/RefineBar';


export default function Index({ auth, discs }) {
    //console.log("届いたデータ:", discs);

    // 選択中のディスクを管理するステート
    const [selectedDisc, setSelectedDisc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // フィルター状態を管理するステート
    const [filters, setFilters] = useState({
        artist: 'All',
        country: 'All',
        category: 'All',
        is_purchased: 'All',
        sort: 'desc'
    });

    // モーダルを開く関数
    const handleOpenModal = (disc) => {
        setSelectedDisc(disc);
        setIsModalOpen(true);
    };

    // --- フィルタリング処理 ---
    const filteredDiscs = discs.filter(disc => {
        // 1. アーティスト
        const matchArtist = filters.artist === 'All' || disc.artist === filters.artist;

        // 2. 国
        const matchCountry = filters.country === 'All' || disc.country === filters.country;

        // 3. カテゴリー (includesを使うJava版の技を継承！)
        const matchCategory = filters.category === 'All' || (disc.category && disc.category.includes(filters.category));

        // 4. 【重要】購入済み判定（新しいテーブル構造に対応！）
        // Laravelのコントローラーで editions.userStatus を読み込んでいたよね。
        // 「どれか一つのエディションでも所持していたら所持」とする判定例：
        const isPurchased = disc.editions?.some(edition => edition.user_status?.is_purchased === 1);

        let matchPurchased = true;
        if (filters.is_purchased === 'Purchased') {
            matchPurchased = isPurchased === true;
        } else if (filters.is_purchased === 'NotPurchased') {
            matchPurchased = isPurchased === false;
        }

        return matchArtist && matchCountry && matchCategory && matchPurchased;
    });

    // --- ソート処理 ---
    const sortedDiscs = [...filteredDiscs].sort((a, b) => {
        const dateA = new Date(a.release_date); // カラム名がスネークケースならこれ
        const dateB = new Date(b.release_date);
        return filters.sort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // メンバー別テーマ切替
    const themeClass = (filters.artist !== 'All' && filters.artist !== 'SHINee')
        ? `theme-${filters.artist.toLowerCase()} member-mode`
        : '';

    return (
        <div className={`transition-colors duration-500 ${themeClass}`}>
            <Head title="SHINee Collection Tracker" />

            {/* ヘッダー・コンポーネントに置き換え */}
            <Header title="SHINee Collection Tracker" />

            {/* フィルタリング・ソート機能コンポーネント */}
            <RefineBar
                allDiscs={discs}
                filters={filters}
                setFilters={setFilters}
            />

            <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">

                {/* 円盤カードのグリッド・コンポーネント置き換え */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 全データの discs ではなく、計算後の sortedDiscs を使う！ */}
                    {sortedDiscs.map((disc) => (
                        <DiscCard key={disc.id} disc={disc}
                            // カードクリック時にモーダルを開く
                            onClick={() => handleOpenModal(disc)}
                        />
                    ))}
                </div>

            </main>

            {/* 4. モーダルを配置 */}
            <DiscModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                disc={selectedDisc}
            />

            {/* ボトムナビゲーション・コンポーネント置き換え */}
            <Footer />
        </div>
    );
}