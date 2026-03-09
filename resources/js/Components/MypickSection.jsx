import React, { useState } from 'react';
import { router } from '@inertiajs/react'; // routerを忘れずに！
import BaseCard from './BaseCard';
import MypickCard from './MypickCard';

export default function MypickSection({ items, selected, memberConfig }) {

  const [selectedMembers, setSelectedMembers] = useState([selected]);

  const handleMemberToggle = (name) => {
    let newSelection;
    if (selectedMembers.includes(name)) {
      newSelection = selectedMembers.filter(m => m !== name);
    } else {
      newSelection = [...selectedMembers, name];
    }

    // ステートを更新（これで見た目の .is-active が切り替わる）
    setSelectedMembers(newSelection);

    // Inertiaでサーバーにリクエストを送る
    // 'members' というキーで配列をそのまま飛ばせる
    router.get('/mypage', {
      members: newSelection
    }, {
      preserveState: true, // 入力状態をキープ
      preserveScroll: true, // スクロール位置を維持
      replace: true        // 履歴がメンバー選ぶたびに増えないようにする
    });
  };

  return (
    <BaseCard title="Mypick Collection">
      {/* 顔文字を使用したマルチセレクター */}
      <div className="flex flex-wrap justify-center gap-2 my-4">
        {memberConfig.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => handleMemberToggle(m.name)}
            className={`kaomoji-chip ${selectedMembers.includes(m.name) ? 'is-active' : ''}`}
          >
            <span className="text-lg leading-none">{m.emoji}</span>
          </button>
        ))}
      </div>

      {/* 2. 表示の分岐ロジック */}
      <div className="p-4 min-h-[200px] flex items-center justify-center">
        {selectedMembers.length === 0 ? (
          /* --- メンバー未選択時のメッセージ --- */
          <div className="text-center animate-fade-in">
            <p className="text-[#81d4af] font-black text-lg mb-2">
              メンバーをタップして<br />ランダムコレクションを眺めよう🌟
            </p>
            <p className="text-gray-400 text-xs">
              複数選択も可能です！
            </p>
          </div>
        ) : (
          /* --- メンバー選択時のカードグリッド --- */
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 w-full">
            {items.map((item) => (
              <div key={item.item_id} className="mypick-card">
                {/* 4:3の枠と所持状況（grayscale）のロジックをここに */}
                <MypickCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>

    </BaseCard>
  );
}