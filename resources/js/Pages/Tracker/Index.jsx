import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import DiscCard from '@/Components/DiscCard';
import DiscModal from '@/Components/DiscModal/DiscModal';
import DiscRefine from '@/Components/DiscRefine';
import UserNav from '@/Components/UserNav';

export default function Index({ auth, discs }) {

    // 1. 状態管理: 選択中のディスクとモーダルの開閉
    const [selectedDisc, setSelectedDisc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. フィルタリング状態: 初期値はすべて 'All'
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
    // Laravelから届いた全データを、ユーザーが選択した条件で絞り込む
    const filteredDiscs = discs.filter(disc => {
        const matchArtist = filters.artist === 'All' || disc.artist === filters.artist;
        const matchCountry = filters.country === 'All' || disc.country === filters.country;

        // Java版の「複数カテゴリを文字列で持つ」仕様を継承し、部分一致で判定
        const matchCategory = filters.category === 'All' || (disc.category && disc.category.includes(filters.category));

        // 所持フラグ判定: リレーション先の user_status を確認（Laravelリプレイスでの新機能）
        // どれか一つのエディションでも所持していたら所持とする
        const isPurchased = disc.editions?.some(edition => {
            const status = edition.user_status;
            // statusが存在して、かつ is_purchased が「真（1 または true）」ならOK
            return Boolean(status?.is_purchased);
        });

        let matchPurchased = true;
        if (filters.is_purchased === 'Purchased') {
            matchPurchased = isPurchased === true;
        } else if (filters.is_purchased === 'NotPurchased') {
            matchPurchased = isPurchased === false;
        }

        return matchArtist && matchCountry && matchCategory && matchPurchased;
    });

    // --- ソート処理 ---
    // 絞り込み後のデータを、新しい順/古い順に並び替え
    const sortedDiscs = [...filteredDiscs].sort((a, b) => {
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        return filters.sort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // メンバー別テーマ切替: 選択されたアーティストに応じてCSSクラスを付与
    const themeClass = (filters.artist !== 'All' && filters.artist !== 'SHINee')
        ? `theme-${filters.artist.toLowerCase()} member-mode`
        : '';

    return (
        <div className={`transition-colors duration-500 ${themeClass}`}>
            <Head title="SHINee Collection Tracker" />

            {/* ヘッダー */}
            <Header title="SHINee Collection Tracker" />

            {/* ユーザーナビ */}
            <UserNav auth={auth} />

            {/* フィルタリング・ソート機能 */}
            <DiscRefine
                allDiscs={discs}
                filters={filters}
                setFilters={setFilters}
            />

            <main className="p-6 pb-[7rem] max-w-[1200px] mx-auto">

                {/* 円盤カードのグリッド */}
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

            {/* モーダル */}
            <DiscModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                disc={selectedDisc}
            />

            {/* フッター・ボトムナビ */}
            <Footer />
        </div>
    );
}