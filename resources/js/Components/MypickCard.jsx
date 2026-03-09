import React from 'react';

export default function MypickCard({ item }) {
  // コントローラ側の parent_info を活用！
  const { artist, disc_title, edition_name } = item.parent_info;

  return (
    <div className="flex flex-col gap-1 w-full group">
      {/* 1. 上部：円盤・形態情報 */}
      <div className="text-[0.6rem] leading-tight text-gray-500 min-h-[2.4em]">
        <span className="font-bold block text-gray-700 truncate" title={disc_title}>
          {disc_title} <span className="text-[0.3rem]">{artist}</span>
        </span>
        <span className="truncate block" title={edition_name}>
          {edition_name}
        </span>
      </div>

      {/* 2. メイン：4:3比率の枠 */}
      {/* 比率 4:3 を維持しつつ、角丸と影で「カード感」を出す */}
      <div className="relative w-full aspect-[3/4] bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm transition-transform group-hover:scale-[1.02]">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_type}
            className="w-full h-full object-cover"
          />
        ) : (
          /* 未所持：グレースケールの背景に文字をちょこんと */
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="material-symbols-outlined">image_not_supported</span>
          </div>
        )}
      </div>

      {/* 3. 下部：アイテム名 */}
      <div className="text-[0.7rem] font-bold text-gray-600 truncate mt-0.5 text-center">
        {item.item_type}
      </div>
    </div>
  );
}