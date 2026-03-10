import React from 'react';
import BaseCard from '../BaseCard';

export default function WishlistSection({ wishlist }) {
  return (
    <BaseCard title="Wishlist">

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-[1rem] border border-[#e0f7f4] shadow-[0_0.2rem_0.5rem_rgba(0,0,0,0.05)] transition-transform duration-200 ease-out hover:-translate-y-[3px] flex flex-col gap-1"
            >
              <div className="wish-item-content">
                {/* アーティスト名 */}
                <span className="block text-[0.7rem] text-[#00c7b1] font-bold mb-[0.2rem]">
                  {item.disc?.artist || 'SHINee'}
                </span>

                {/* 円盤タイトル */}
                <span className="block text-[0.9rem] font-semibold text-[#333] line-height-[1.2]">
                  {item.disc?.title || 'Unknown Title'}
                </span>

                {/* 形態名タグ */}
                <span className="inline-block mt-2 text-[0.7rem] bg-[#f0f0f0] px-2 py-px rounded-[0.5rem] text-[#666]">
                  {item.display_name || '通常盤'}
                </span>
              </div>
            </div>
          ))
        ) : (
          /* リストが空の時の表示 */
          <div className="col-span-full text-center py-8 text-[#aaa] font-bold">
            まだリストは空です 💎
          </div>
        )}
      </div>
    </BaseCard>
  );
}